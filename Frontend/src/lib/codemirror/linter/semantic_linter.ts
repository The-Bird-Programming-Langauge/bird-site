// Performs semantic linting, which is showing live errors for semantic issues.
// Does this by traversing the syntax tree like a visitor and checking for errors in incomplete objects through a cursor iterator.

import { TreeCursor } from "@lezer/common";
import { linter, type Diagnostic } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { Environment } from "./sym_table";
import { SemanticValue } from "./value";

export const semantic_linter = linter((context: EditorView) => {
  let diagnostics: Array<Diagnostic> = [];

  let env = new Environment<SemanticValue>();
  env.push_env();
  let loop_depth = 0;
  let function_depth = 0;
  let found_return = false;

  const cursor: TreeCursor = syntaxTree(context.state).cursor();
  visit_program(cursor.node.cursor());

  return diagnostics;

  function visit_program(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Stmt
    do {
      visit_stmt(cursor.node.cursor());
    } while (cursor.nextSibling());
  }

  function visit_stmt(cursor: TreeCursor) {
    if (cursor.name === "Stmt") {
      if (!cursor.firstChild()) return; // Block_valid_stmt
    }

    if (!cursor.firstChild()) return; // stmt

    if (cursor.name === "Block") {
      visit_block(cursor.node.cursor());
    } else if (cursor.name === "Decl_stmt") {
      visit_decl_stmt(cursor.node.cursor());
    } else if (cursor.name === "Expr_stmt") {
      visit_expr_stmt(cursor.node.cursor());
    } else if (cursor.name === "Print_stmt") {
      visit_print_stmt(cursor.node.cursor());
    } else if (cursor.name === "Const_stmt") {
      visit_const_stmt(cursor.node.cursor());
    } else if (cursor.name === "While_stmt") {
      visit_while_stmt(cursor.node.cursor());
    } else if (cursor.name === "For_stmt") {
      visit_for_stmt(cursor.node.cursor());
    } else if (cursor.name === "If_stmt") {
      visit_if_stmt(cursor.node.cursor());
    } else if (cursor.name === "Return_stmt") {
      visit_return_stmt(cursor.node.cursor());
    } else if (cursor.name === "Break_stmt") {
      visit_break_stmt(cursor.node.cursor());
    } else if (cursor.name === "Continue_stmt") {
      visit_continue_stmt(cursor.node.cursor());
    }
  }

  function visit_block(cursor: TreeCursor) {
    env.push_env();
    
    if (!cursor.firstChild()) return; // LBRACE
  
    if (!cursor.nextSibling() || cursor.name !== "Block_valid_stmt") return; // Block_valid_stmt
    do {
      visit_stmt(cursor.node.cursor());
    } while (cursor.nextSibling() && cursor.name === "Block_valid_stmt"); // Block_valid_stmt
  
    env.pop_env();
  }
  
  function visit_decl_stmt(cursor: TreeCursor) {
    let failed_redeclaration = false;
    
    if (!cursor.firstChild()) return; // var
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      failed_redeclaration = true;
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
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

    if (failed_redeclaration) return;
    const mutable_value = new SemanticValue();
    mutable_value.is_mutable = true;
    env.declare(identifier_text, mutable_value);
  }

  function visit_expr_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // print
    visit_expr(cursor.node.cursor());
  }

  function visit_print_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    do {
      if (cursor.name != "COMMA" && cursor.name != "SEMICOLON") {
        visit_expr(cursor);
      }
    } while (cursor.nextSibling());
  }
  
  function visit_const_stmt(cursor: TreeCursor) {
    let failed_redeclaration = false;
    
    if (!cursor.firstChild()) return; // const
    if (!cursor.nextSibling() || cursor.name !== "IDENTIFIER") return; // IDENTIFIER
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (identifier_in_any_environment(identifier_text)) {
      failed_redeclaration = true;
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Identifier '${identifier_text}' is already declared.`,
      });
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
    
    if (failed_redeclaration) return;
    env.declare(identifier_text, new SemanticValue());
  }
  
  function visit_while_stmt(cursor: TreeCursor) {
    loop_depth += 1;

    if (!cursor.firstChild()) return; // while
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling() || cursor.name as string !== "Block") return; // Block
    visit_block(cursor.node.cursor());
  
    loop_depth -= 1;
  }
  
  function visit_for_stmt(cursor: TreeCursor) {
    loop_depth += 1;
    env.push_env();
  
    if (!cursor.firstChild()) return; // for
    if (!cursor.nextSibling()) return; // Block_valid_stmt or SEMICOLON
    if (cursor.name === "Block_valid_stmt") {
      visit_stmt(cursor.node.cursor());
    }
  
    if (!cursor.nextSibling()) return; // Expr or SEMICOLON
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
  
    env.pop_env();
    loop_depth -= 1;
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
  
  function visit_return_stmt(cursor: TreeCursor) {
    found_return = true;

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

  function visit_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // expr

    if (cursor.name === "Binary_expr") {
      visit_binary(cursor.node.cursor());
    } else if (cursor.name === "Unary_expr") {
      visit_unary_expr(cursor.node.cursor());
    } else if (cursor.name === "Primary") {
      visit_primary(cursor.node.cursor());
    } else if (cursor.name === "Ternary_expr") {
      visit_ternary_expr(cursor.node.cursor());
    } else if (cursor.name === "Assign_expr") {
      visit_assign_expr(cursor.node.cursor());
    } else if (cursor.name === "Grouping") {
      visit_grouping(cursor.node.cursor());
    }
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
  
  function visit_primary(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // IDENTIFIER
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
  }
  
  function visit_ternary_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // QUESTION
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // COLON
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }
  
  function visit_assign_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Primary
    const identifier_node = cursor.node.cursor();
    const identifier_text = get_text(identifier_node);

    if (!env.contains(identifier_text)) {
      diagnostics.push({
        from: identifier_node.from,
        to: identifier_node.to,
        severity: "error",
        message: `Variable '${identifier_text}' does not exist.`,
      });
      return;
    }

    if (!cursor.nextSibling()) return; // ASSIGN_OP
    if (!cursor.nextSibling() || cursor.name as string !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  
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

  function visit_grouping(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LPAREN
    if (!cursor.nextSibling() || cursor.name !== "Expr") return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function identifier_in_any_environment(identifier: string): boolean {
    return env.current_contains(identifier);
  }

  function get_text(cursor: TreeCursor): string {
    return context.state.sliceDoc(cursor.from, cursor.to);
  }
});