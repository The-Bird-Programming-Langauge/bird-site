// Performs semantic linting, which is showing live errors for semantic issues.
// Does this by traversing the syntax tree like a visitor and checking for errors in incomplete objects through a cursor iterator.

import { TreeCursor } from "@lezer/common";
import { linter, type Diagnostic } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { ImportPath } from "../include/import_path";
import { FunctionImportItem, ImportEnvironment, StructImportItem, TypeImportItem, VariableImportItem } from "../include/import_env";
import { Environment } from "../include/sym_table";
import { SemanticValue } from "../include/value";
import { SemanticCallable } from "../include/callable";
import { SemanticType } from "../include/type";

export const semantic_linter = linter((context: EditorView) => {
  let diagnostics: Array<Diagnostic> = [];

  let standard_library = new ImportEnvironment();
  init_standard_library();

  const import_identifiers: Set<string> = new Set();

  let env = new Environment<SemanticValue>();
  env.push_env();

  let call_table = new Environment<SemanticCallable>();
  call_table.push_env();
  init_call_table();

  let type_table = new Environment<SemanticType>();
  type_table.push_env();

  let loop_depth = 0;
  let function_depth = 0;
  let in_method = false;

  const cursor: TreeCursor = syntaxTree(context.state).cursor();
  visit_program(cursor.node.cursor());

  return diagnostics;

  function init_standard_library() {
    standard_library.add_item(new ImportPath("Math::Trig::arccos"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::arcsin"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::arctan"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::cos"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::sin"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::tan"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::to_degrees"), new FunctionImportItem);
    standard_library.add_item(new ImportPath("Math::Trig::Triangle"), new StructImportItem);
  }

  function init_call_table() {
    call_table.declare("length", new SemanticCallable());
    call_table.declare("push", new SemanticCallable());
    call_table.declare("gc", new SemanticCallable());
    call_table.declare("iter", new SemanticCallable());
  }

  function visit_program(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Top_level_stmt
    do {
      visit_top_level_stmt(cursor.node.cursor());
    } while (cursor.nextSibling());
  }

  function visit_top_level_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // top_level_stmt

    if (cursor.name === "Func") {
      visit_func(cursor.node.cursor());
    } else if (cursor.name === "Struct_decl") {
      visit_struct_decl(cursor.node.cursor());
    } else if (cursor.name === "Stmt") {
      visit_stmt(cursor.node.cursor());
    }
  }

  function visit_func(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // fn
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
    } else {
      call_table.declare(identifier_text, new SemanticCallable());
    }

    visit_func_helper(cursor.node.cursor())
  }

  function visit_func_helper(cursor: TreeCursor) {
    function_depth += 1;
    env.push_env();

    try {
      if (!cursor.nextSibling()) return; // LPAREN
      if (!cursor.nextSibling()) return; // IDENTIFIER or RPAREN

      while (cursor.name === "IDENTIFIER") {
        const identifier_node = cursor.node.cursor();
        const identifier_text = get_text(identifier_node);

        if (identifier_in_any_environment(identifier_text)) {
          diagnostics.push({
            from: identifier_node.from,
            to: identifier_node.to,
            severity: "error",
            message: `Identifier '${identifier_text}' is already declared.`,
          });
        } else {
          env.declare(identifier_text, new SemanticValue(true));
        }

        if (!cursor.nextSibling()) return; // COLON
        if (!cursor.nextSibling()) return; // Type_identifier
        if (!cursor.nextSibling()) return; // COMMA or RPAREN
        if (cursor.name as string === "COMMA") {
          if (!cursor.nextSibling()) return; // IDENTIFIER
        }
      }

      if (!cursor.nextSibling()) return; // ARROW or Block
      if (cursor.name === "ARROW") {
        if (!cursor.nextSibling()) return; // Type_identifier
        if (!cursor.nextSibling()) return; // Block
      }

      if (cursor.name !== "Block") return;

      if (!cursor.firstChild()) return; // LBRACE
      if (!cursor.nextSibling() || cursor.name as string !== "Stmt") return;
      do {
        visit_stmt(cursor.node.cursor());
      } while (cursor.nextSibling() && cursor.name as string === "Stmt");
    } finally {
      env.pop_env();
      function_depth -= 1;
    }
  }

  function visit_struct_decl(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // struct
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
    } else {
      type_table.declare(identifier_text, new SemanticType());
    }

    if (!cursor.nextSibling()) return; // LBRACE
    if (!cursor.nextSibling()) return; // Func or Prop_decl or RBRACE

    while (cursor.name as string === "Func" || cursor.name as string === "Prop_decl") {
      if (cursor.name as string === "Func") {
        visit_method(cursor.node.cursor());
      }
      
      if (!cursor.nextSibling()) return; // Func or Prop_decl or RBRACE
    }
  }

  function visit_method(cursor: TreeCursor) {
    in_method = true;
    visit_func(cursor.node.cursor());
    in_method = false;
  }

  function visit_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // stmt

    if (cursor.name === "Decl_stmt") {
      visit_decl_stmt(cursor.node.cursor());
    } else if (cursor.name === "If_stmt") {
      visit_if_stmt(cursor.node.cursor());
    } else if (cursor.name === "Const_stmt") {
      visit_const_stmt(cursor.node.cursor());
    } else if (cursor.name === "Print_stmt") {
      visit_print_stmt(cursor.node.cursor());
    } else if (cursor.name === "Block") {
      visit_block(cursor.node.cursor());
    } else if (cursor.name === "While_stmt") {
      visit_while_stmt(cursor.node.cursor());
    } else if (cursor.name === "For_stmt") {
      visit_for_stmt(cursor.node.cursor());
    } else if (cursor.name === "Return_stmt") {
      visit_return_stmt(cursor.node.cursor());
    } else if (cursor.name === "Break_stmt") {
      visit_break_stmt(cursor.node.cursor());
    } else if (cursor.name === "Namespace_stmt") {
      visit_namespace_stmt(cursor.node.cursor());
    } else if (cursor.name === "Continue_stmt") {
      visit_continue_stmt(cursor.node.cursor());
    } else if (cursor.name === "Expr_stmt") {
      visit_expr_stmt(cursor.node.cursor());
    } else if (cursor.name === "Type_stmt") {
      visit_type_stmt(cursor.node.cursor());
    } else if (cursor.name === "Import_stmt") {
      visit_import_stmt(cursor.node.cursor());
    }
  }
  
  function visit_decl_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // var
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
    } else {
      env.declare(identifier_text, new SemanticValue(true));
    }

    if (!cursor.nextSibling()) return; // COLON or EQUAL
    if (!cursor.nextSibling()) return; // Type_identifier or Expr

    if (cursor.name as string === "Type_identifier") {
      if (!cursor.nextSibling()) return; // EQUAL
      if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
      visit_expr(cursor.node.cursor());
    } else if (cursor.name as string === "Expr"){
      visit_expr(cursor.node.cursor());
    } else {
      return;
    }
  }
  
  function visit_if_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // if
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling() || cursor.name as string !== "Block") return; // Block
    visit_block(cursor.node.cursor());
  
    if (!cursor.nextSibling()) return; // else
    if (!cursor.nextSibling()) return; // Block or If_stmt
    if (cursor.name as string === "Block") {
      visit_block(cursor.node.cursor());
    } else if (cursor.name as string === "If_stmt") {
      visit_if_stmt(cursor.node.cursor());
    }
  }
  
  function visit_const_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // const
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
    } else {
      env.declare(identifier_text, new SemanticValue());
    }
  
    if (!cursor.nextSibling()) return; // COLON or EQUAL
    if (!cursor.nextSibling()) return; // Type_identifier or Expr
    
    if (cursor.name as string === "Type_identifier") {
      if (!cursor.nextSibling()) return; // EQUAL
      if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
      visit_expr(cursor.node.cursor());
    } else if (cursor.name as string === "Expr"){
      visit_expr(cursor.node.cursor());
    } else {
      return;
    }
  }

  function visit_print_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    do {
      if (cursor.name != "COMMA" && cursor.name != "SEMICOLON") {
        visit_expr(cursor);
      }
    } while (cursor.nextSibling());
  }

  function visit_block(cursor: TreeCursor) {
    env.push_env();
    
    try {
      if (!cursor.firstChild()) return; // LBRACE
    
      if (!cursor.nextSibling() || cursor.name !== "Stmt") return;
      do {
        visit_stmt(cursor.node.cursor());
      } while (cursor.nextSibling() && cursor.name === "Stmt");
    } finally {
      env.pop_env();
    }
  }
  
  function visit_while_stmt(cursor: TreeCursor) {
    loop_depth += 1;

    try {
      if (!cursor.firstChild()) return; // while
      if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling() || cursor.name as string !== "Block") return; // Block
      visit_block(cursor.node.cursor());
    } finally {
      loop_depth -= 1;
    }
  }

  function visit_for_stmt(cursor: TreeCursor) {
    loop_depth += 1;
    env.push_env();

    try {
      if (!cursor.firstChild()) return; // for
      if (!cursor.nextSibling()) return; // Stmt or IDENTIFIER or SEMICOLON
      if (cursor.name === "Stmt") {
        visit_stmt(cursor.node.cursor());
      } else if (cursor.name === "IDENTIFIER") {
        env.declare(get_text(cursor.node.cursor()), new SemanticValue(true));
      }

      if (!cursor.nextSibling()) return; // Expr or in or SEMICOLON
      if (cursor.name === "Expr") {
        visit_expr(cursor.node.cursor());
        if (!cursor.nextSibling()) return; // SEMICOLON
      }

      if (!cursor.nextSibling()) return; // Expr or Block
      if (cursor.name === "Expr") {
        visit_expr(cursor.node.cursor());
        if (!cursor.nextSibling()) return; // Block
      }

      if (cursor.name === "Block") {
        visit_block(cursor.node.cursor());
      }
    } finally {
      env.pop_env();
      loop_depth -= 1;
    }
  }

  function visit_return_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // return
    const return_node = cursor.node.cursor();

    let expr_node;
    if (cursor.nextSibling()) { // Expr or SEMICOLON
      if (cursor.name === "Expr") {
        expr_node = cursor.node.cursor();
        cursor.nextSibling(); // SEMICOLON
      }
    }

    const end_node = cursor.node.cursor(); // return or Expr or SEMICOLON
    if (function_depth === 0) {
      diagnostics.push({
        from: return_node.from,
        to: end_node.to,
        severity: "error",
        message: "Return statement is declared outside of a function.",
      });
      return;
    }
  
    if (expr_node) {
      visit_expr(expr_node.node.cursor());
    }
  }
  
  function visit_break_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // break
    const break_node = cursor.node.cursor();

    cursor.nextSibling(); // SEMICOLON
    const end_node = cursor.node.cursor(); // break or SEMICOLON

    if (loop_depth === 0) {
      diagnostics.push({
        from: break_node.from,
        to: end_node.to,
        severity: "error",
        message: "Break statement is declared outside of a loop.",
      });
    }
  }

  function visit_namespace_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // namespace
    if (!cursor.nextSibling()) return; // IDENTIFIER
    if (!cursor.nextSibling()) return; // LBRACE
    if (!cursor.nextSibling()) return; // Namespace_declaration_stmt or RBRACE
    
    while (cursor.name as string === "Namespace_declaration_stmt") {
      let stmt_cursor = cursor.node.cursor();
      stmt_cursor.firstChild();

      if (stmt_cursor.name === "Namespace_stmt") {
        visit_namespace_stmt(stmt_cursor.node.cursor());
      } else if (stmt_cursor.name === "Decl_stmt") {
        visit_decl_stmt(stmt_cursor.node.cursor());
      } else if (stmt_cursor.name === "Const_stmt") {
        visit_const_stmt(stmt_cursor.node.cursor());
      } else if (stmt_cursor.name === "Struct_decl") {
        visit_struct_decl(stmt_cursor.node.cursor());
      } else if (stmt_cursor.name === "Type_stmt") {
        visit_type_stmt(stmt_cursor.node.cursor());
      } else if (stmt_cursor.name === "Func") {
        visit_func(stmt_cursor.node.cursor());
      }

      if (!cursor.nextSibling()) return; // Namespace_declaration_stmt or RBRACE
    }
  }
  
  function visit_continue_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // continue
    const continue_node = cursor.node.cursor();

    cursor.nextSibling(); // SEMICOLON
    const end_node = cursor.node.cursor(); // continue or SEMICOLON

    if (loop_depth === 0) {
      diagnostics.push({
        from: continue_node.from,
        to: end_node.to,
        severity: "error",
        message: "Continue statement is declared outside of a loop.",
      });
    }
  }

  function visit_expr_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // print
    visit_expr(cursor.node.cursor());
  }

  function visit_type_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // type
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    let identifier_node = cursor.node.cursor();
    let identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
    } else {
      type_table.declare(identifier_text, new SemanticType());
    }
  }

  function visit_import_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // import
    if (!cursor.nextSibling()) return; // IDENTIFIER
    let import_paths: ImportPath[] = [];
    let import_path_edge_nodes: [TreeCursor, TreeCursor | null][] = [];

    while (cursor.name === "IDENTIFIER") {
      import_paths.push(new ImportPath(get_text(cursor.node.cursor())));
      import_path_edge_nodes.push([cursor.node.cursor(), null]);

      while (cursor.name === "IDENTIFIER") {
        if (!cursor.nextSibling() || cursor.name as string !== "COLON_COLON") break; // COLON_COLON
        if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") break; // IDENTIFIER
        import_paths[import_paths.length - 1].add_string_token(get_text(cursor.node.cursor()));
        import_path_edge_nodes[import_paths.length - 1][1] = cursor.node.cursor();
      }

      if (cursor.name as string !== "COMMA") break; // COMMA or from
      if (!cursor.nextSibling()) break; // IDENTIFIER
    }

    if (cursor.name as string === "from" && cursor.nextSibling() && cursor.name as string === "IDENTIFIER") {
      let from_path: ImportPath = new ImportPath(get_text(cursor.node.cursor()));
  
      while (cursor.name === "IDENTIFIER") {
        if (!cursor.nextSibling() || cursor.name as string !== "COLON_COLON") break; // COLON_COLON
        if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") break; // IDENTIFIER
        from_path.add_string_token(get_text(cursor.node.cursor()));
      }

      for (let i = 0; i < import_paths.length; i += 1) {
        import_paths[i].insert_import_path_at_beginning(from_path);
      }
    }

    for (let i = 0; i < import_paths.length; i += 1) {
      if (!standard_library.contains_item(import_paths[i])) {
        diagnostics.push({
          from: import_path_edge_nodes[i][0].from,
          to: import_path_edge_nodes[i][1]?.to ?? import_path_edge_nodes[i][0].to,
          severity: "error",
          message: `Import item with path '${import_paths[i].string_path}' does not exist in the standard library.`,
        });
        continue;
      }

      let [recursive_import_paths, recursive_import_items] = standard_library.get_items_recursively(import_paths[i]);
      let repeated_imports: Set<string> = new Set();

      for (let j = 0; j < recursive_import_paths.length; j += 1) {
        if (import_identifiers.has(recursive_import_paths[j].string_path)) {
          repeated_imports.add(recursive_import_paths[j].string_path);
        } else {
          import_identifiers.add(recursive_import_paths[j].string_path);
          let import_path_back = recursive_import_paths[j].path[recursive_import_paths[j].path.length - 1];

          if (recursive_import_items[j] instanceof VariableImportItem) {
            env.declare(import_path_back, new SemanticValue());
          } else if (recursive_import_items[j] instanceof FunctionImportItem) {
            call_table.declare(import_path_back, new SemanticCallable());
          } else if (recursive_import_items[j] instanceof TypeImportItem) {
            type_table.declare(import_path_back, new SemanticType());
          }
        }
      }

      if (repeated_imports.size > 0) {
        let repeated_imports_string = "";

        let j = 0;
        for (let item of repeated_imports) {
          repeated_imports_string += item;

          if (j < repeated_imports.size - 1) {
            repeated_imports_string += ", ";
          }

          j += 1;
        }

        diagnostics.push({
          from: import_path_edge_nodes[i][0].from,
          to: import_path_edge_nodes[i][1]?.to ?? import_path_edge_nodes[i][0].to,
          severity: "error",
          message: `Import path overrides the following import items that already exists in the global namespace: ${repeated_imports_string}`,
        });
      }
    }
  }

  function visit_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // expr

    if (cursor.name === "Assign_expr") {
      visit_assign_expr(cursor.node.cursor());
    } else if (cursor.name === "Ternary_expr") {
      visit_ternary(cursor.node.cursor());
    } else if (cursor.name === "Binary_expr") {
      visit_binary(cursor.node.cursor());
    } else if (cursor.name === "Unary_expr") {
      visit_unary_expr(cursor.node.cursor());
    } else if (cursor.name === "Type_cast") {
      visit_as_cast(cursor.node.cursor());
    } else if (cursor.name === "Call_expr") {
      visit_call(cursor.node.cursor());
    } else if (cursor.name === "Method_call") {
      visit_method_call(cursor.node.cursor());
    } else if (cursor.name === "Subscript_expr") {
      visit_subscript(cursor.node.cursor());
    } else if (cursor.name === "Index_assign") {
      visit_index_assign(cursor.node.cursor());
    } else if (cursor.name === "Direct_member_access") {
      visit_direct_member_access(cursor.node.cursor());
    } else if (cursor.name === "Struct_initialization") {
      visit_struct_initialization(cursor.node.cursor());
    } else if (cursor.name === "Array_initialization") {
      visit_array_init(cursor.node.cursor());
    } else if (cursor.name === "Match") {
      visit_match_expr(cursor.node.cursor());
    } else if (cursor.name === "Scope_resolution") {
      visit_scope_resolution(cursor.node.cursor());
    } else if (cursor.name === "Primary") {
      visit_primary(cursor.node.cursor());
    } else if (cursor.name === "Grouping") {
      visit_grouping(cursor.node.cursor());
    }
  }

  function visit_assign_expr(cursor: TreeCursor) {
    let had_primary = false;
    let identifier_node = cursor.node.cursor();
    let identifier_text = "";

    if (!cursor.firstChild()) return; // Primary or Direct_member_access
    if (cursor.name === "Primary") {
      had_primary = true;
      identifier_node = cursor.node.cursor();
      identifier_text = get_text(identifier_node);

      if (!env.contains(identifier_text)) {
        diagnostics.push({
          from: identifier_node.from,
          to: identifier_node.to,
          severity: "error",
          message: `Variable '${identifier_text}' does not exist.`,
        });
        return;
      }
    } else if (cursor.name === "Direct_member_access") {
      visit_direct_member_access(cursor.node.cursor());
    }

    if (!cursor.nextSibling()) return; // ASSIGN_OP
    if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  
    if (!had_primary) return;
    const previous_value = env.get(identifier_text);
    if (!previous_value.is_mutable) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is not mutable.`,
      });
    }
  }
  
  function visit_ternary(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // QUESTION
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // COLON
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }
  
  function visit_binary(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // binary_op
    if (!cursor.nextSibling()) return; // Expr
    visit_expr(cursor.node.cursor());
  }
  
  function visit_unary_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // PREFIX_UNARY_OP
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_as_cast(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_method_call(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // DOT
    if (!cursor.nextSibling() || cursor.name as string !== "Call_expr") return; // Call_expr
    visit_call(cursor.node.cursor());
  }

  function visit_call(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (!call_table.contains(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Function call identifier '${identifier_text}' is not declared.`,
      });
    }
  }

  function visit_subscript(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // LBRACKET
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_index_assign(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Subscript_expr
    visit_subscript(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // ASSIGN_OP
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_direct_member_access(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_struct_initialization(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // IDENTIFIER
    if (!cursor.nextSibling()) return; // LBRACE
    if (!cursor.nextSibling()) return; // IDENTIFIER or RBRACE

    while (cursor.name as string === "IDENTIFIER") {
      if (!cursor.nextSibling()) return; // EQUAL
      if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling()) return; // COMMA or RBRACE
      if (cursor.name === "RBRACE") break;

      if (!cursor.nextSibling()) return; // IDENTIFIER or RBRACE
    }
  }

  function visit_array_init(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LBRACKET
    if (!cursor.nextSibling()) return; // Expr or RBRACKET

    while (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling() || cursor.name as string !== "COMMA") return; // COMMA or RBRACKET
      if (!cursor.nextSibling()) return; // Expr
    }
  }

  function visit_match_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // match
    if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // LBRACE
    if (!cursor.nextSibling()) return; // Expr or else

    while (cursor.name as string === "Expr") {
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling()) return; // FAT_ARROW
      if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling()) return; // COMMA or else
      if (cursor.name !== "COMMA") break;

      if (!cursor.nextSibling()) return; // Expr or else
    }

    if (cursor.name === "RBRACE") return; // else
    if (!cursor.nextSibling()) return; // FAT_ARROW
    if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_scope_resolution(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // IDENTIFIER
    if (!cursor.nextSibling()) return; // COLON_COLON
    if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }
  
  function visit_primary(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // primary

    if (cursor.name === "IDENTIFIER") {
      const identifier_node = cursor.node.cursor();
      const identifier_text = get_text(identifier_node);

      if (identifier_node.name === "IDENTIFIER" && !env.contains(identifier_text)) {
        diagnostics.push({
          from: identifier_node.from,
          to: identifier_node.to,
          severity: "error",
          message: `Variable '${identifier_text}' does not exist.`,
        });
      }
    } else if (cursor.name === "self") {
      if (!in_method) {
        diagnostics.push({
          from: cursor.from,
          to: cursor.to,
          severity: "error",
          message: "Use of self outside of struct member function.",
        });
      }
    }
  }

  function visit_grouping(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LPAREN
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function identifier_in_any_environment(identifier: string): boolean {
    return (
      env.current_contains(identifier) ||
      call_table.current_contains(identifier) ||
      type_table.current_contains(identifier)
    );
  }

  function get_text(cursor: TreeCursor): string {
    return context.state.sliceDoc(cursor.from, cursor.to);
  }
});