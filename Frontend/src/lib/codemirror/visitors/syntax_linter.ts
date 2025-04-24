// Performs syntax linting, which is showing live warnings for syntax issues.

import { TreeCursor } from "@lezer/common";
import { linter, type Diagnostic } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

export const syntax_linter = linter((context: EditorView) => {
  let diagnostics: Array<Diagnostic> = [];

  const cursor: TreeCursor = syntaxTree(context.state).cursor();
  visit_program(cursor.node.cursor());

  return diagnostics;
  
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
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;

    visit_func_helper(cursor.node.cursor())
  }

  function visit_func_helper(cursor: TreeCursor) {
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("LPAREN", "'('", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token(["IDENTIFIER", "RPAREN"], "identifier or ')'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    while (cursor.name === "IDENTIFIER") {
      if (!cursor.nextSibling()) return;
      if (expect_token("COLON", "':'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      visit_type_identifier(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token(["COMMA", "RPAREN"], "',' or ')'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      if (cursor.name as string === "COMMA") {
        if (!cursor.nextSibling()) return;
        if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
        previous_node = cursor.node.cursor();
      }
    }

    if (!cursor.nextSibling()) return;
    if (expect_token(["ARROW", "Block"], "'->' or block", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (cursor.name === "ARROW") {
      if (!cursor.nextSibling()) return;
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      visit_type_identifier(cursor.node.cursor());
      previous_node = cursor.node.cursor();
      
      if (!cursor.nextSibling()) return;
      if (expect_token("Block", "block", cursor, previous_node)) return;
    }

    if (cursor.name !== "Block") return;
      
    if (!cursor.firstChild()) return;
    if (expect_token("LBRACE", "'{'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();
    const lbrace_node = cursor.node.cursor();

    while (cursor.nextSibling() && cursor.name as string === "Stmt") {
      visit_stmt(cursor.node.cursor());
    }

    if (cursor.name as string !== "RBRACE") {
      diagnostics.push({
        from: lbrace_node.from,
        to: lbrace_node.to,
        severity: "warning",
        message: "Block is missing a closing brace.",
      });
    }
  }

  function visit_struct_decl(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // struct
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("LBRACE", "'{'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token(["Func", "Prop_decl", "RBRACE"], "function or property declaration or '}'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    while (cursor.name as string === "Func" || cursor.name as string === "Prop_decl") {
      if (cursor.name as string === "Func") {
        visit_method(cursor.node.cursor());
      } else if (cursor.name as string === "Prop_decl") {
        if (!cursor.firstChild()) return;
        if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
        previous_node = cursor.node.cursor();

        if (!cursor.nextSibling()) return;
        if (expect_token("COLON", ":", cursor, previous_node)) return;
        previous_node = cursor.node.cursor();

        if (!cursor.nextSibling()) return;
        if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
        visit_type_identifier(cursor.node.cursor());
        previous_node = cursor.node.cursor();

        if (!cursor.nextSibling()) return;
        if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
        previous_node = cursor.node.cursor();
        cursor.parent();
      }

      if (!cursor.nextSibling()) return;
      if (expect_token(["Func", "Prop_decl", "RBRACE"], "function or property declaration or '}'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    }

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }

  function visit_method(cursor: TreeCursor) {
    visit_func(cursor.node.cursor());
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
    } else if (cursor.name === "Continue_stmt") {
      visit_continue_stmt(cursor.node.cursor());
    } else if (cursor.name === "Expr_stmt") {
      visit_expr_stmt(cursor.node.cursor());
    } else if (cursor.name === "Type_stmt") {
      visit_type_stmt(cursor.node.cursor());
    }
  }

  function visit_block(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LBRACE
    const lbrace_node = cursor.node.cursor();

    while (cursor.nextSibling() && cursor.name === "Stmt") {
      visit_stmt(cursor.node.cursor());
    }

    if (cursor.name as string !== "RBRACE") {
      diagnostics.push({
        from: lbrace_node.from,
        to: lbrace_node.to,
        severity: "warning",
        message: "Block is missing a closing brace.",
      });
    }
  }
  
  function visit_decl_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // var
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (cursor.name as string === "COLON") {
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      visit_type_identifier(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
    }
    
    if (expect_token(["EQUAL", "COLON"], "'=' or ':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }

  function visit_expr_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_print_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // print
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    while (cursor.nextSibling()) {
      if (cursor.name === "COMMA") {
        previous_node = cursor.node.cursor();

        if (!cursor.nextSibling()) return;
        if (expect_token("Expr", "expression", cursor, previous_node)) return;
        visit_expr(cursor.node.cursor());
        previous_node = cursor.node.cursor();

        if (!cursor.nextSibling()) return;
      }
      
      if (expect_token(["COMMA", "SEMICOLON"], "',' or ';'", cursor, previous_node)) return;
    } 
  }
  
  function visit_const_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // const
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (cursor.name as string === "COLON") {
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      visit_type_identifier(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
    }
    
    if (expect_token(["EQUAL", "COLON"], "'=' or ':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }
  
  function visit_while_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // while
    let previous_node = cursor.node.cursor();
    
    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Block", "block", cursor, previous_node)) return;
    visit_block(cursor.node.cursor());
  }
  
  function visit_for_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // for
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (cursor.name === "Stmt") {
      visit_stmt(cursor.node.cursor());
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "SEMICOLON") {
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Stmt", "SEMICOLON"], "statement or ';'", cursor, previous_node)) return;
    }

    if (!cursor.nextSibling()) return;
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "SEMICOLON") {
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Expr", "SEMICOLON"], "expression or ';'", cursor, previous_node)) return;
    }

    if (!cursor.nextSibling()) return;
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Block", "block", cursor, previous_node)) return;
      visit_block(cursor.node.cursor());
    } else if (cursor.name === "Block") {
      visit_block(cursor.node.cursor());
    } else {
      if (expect_token(["Expr", "Block"], "expression or block", cursor, previous_node)) return;
    }
  }
  
  function visit_if_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // if
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Block", "block", cursor, previous_node)) return;
    visit_block(cursor.node.cursor());
    previous_node = cursor.node.cursor();
  
    if (!cursor.nextSibling()) return; // else
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (cursor.name === "Block") {
      visit_block(cursor.node.cursor());
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "If_stmt") {
      visit_if_stmt(cursor.node.cursor());
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Block", "If_stmt"], "block or if statement", cursor, previous_node)) return;
    }
  }
  
  function visit_return_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return;
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "SEMICOLON") {
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Expr", "SEMICOLON"], "expression or ';'", cursor, previous_node)) return;
    }
  }
  
  function visit_break_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // break
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }
  
  function visit_continue_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // continue
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }

  function visit_type_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // type
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("EQUAL", "'='", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
    visit_type_identifier(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
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
    } else if (cursor.name === "Primary") {
      visit_primary(cursor.node.cursor());
    } else if (cursor.name === "Grouping") {
      visit_grouping(cursor.node.cursor());
    }
  }
  
  function visit_assign_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Primary or Direct_member_access
    if (cursor.name === "Direct_member_access") {
      visit_direct_member_access(cursor.node.cursor());
    }

    if (!cursor.nextSibling()) return; // ASSIGN_OP
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }
  
  function visit_ternary(cursor: TreeCursor) {
    if (cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (cursor.nextSibling()) return; // QUESTION
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("COLON", "':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }
  
  function visit_binary(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // binary_op
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }
  
  function visit_unary_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // PREFIX_UNARY_OP
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }

  function visit_as_cast(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return;
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
    visit_type_identifier(cursor.node.cursor());
  }

  function visit_method_call(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // DOT
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Call_expr", "call expression", cursor, previous_node)) return;
    visit_call(cursor.node.cursor());
  }

  function visit_call(cursor: TreeCursor) {
    // TODO: Implement this.
  }

  function visit_subscript(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // LBRACKET
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("RBRACKET", "']'", cursor, previous_node)) return;
  }

  function visit_index_assign(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Subscript_expr
    visit_subscript(cursor.node.cursor());
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("ASSIGN_OP", "assignment operator", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }

  function visit_direct_member_access(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (!cursor.nextSibling()) return; // DOT
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
  }

  function visit_struct_initialization(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // IDENTIFIER
    if (!cursor.nextSibling()) return; // LBRACE
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token(["IDENTIFIER", "RBRACE"], "identifier or '}'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    while (cursor.name as string === "IDENTIFIER") {
      if (!cursor.nextSibling()) return;
      if (expect_token("EQUAL", "'='", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Expr", "expression", cursor, previous_node)) return;
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token(["COMMA", "RBRACE"], "',' or '}'", cursor, previous_node)) return;
      if (cursor.name === "RBRACE") break;
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token(["IDENTIFIER", "RBRACE"], "identifier or '}'", cursor, previous_node)) return;
    }
  }

  function visit_array_init(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LBRACKET
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token(["Expr", "RBRACKET"], "expression or ']'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    while (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());

      if (!cursor.nextSibling()) return;
      if (expect_token(["COMMA", "RBRACKET"], "',' or ']'", cursor, previous_node)) return;
      if (cursor.name as string === "RBRACKET") return;
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Expr", "expression", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    }
  }

  function visit_match_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // match
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("LBRACE", "'{'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token(["Expr", "else"], "expression or else", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    while (cursor.name as string === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("FAT_ARROW", "'=>'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("Expr", "expression", cursor, previous_node)) return;
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token(["COMMA", "else"], "',' or 'else'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
      if (cursor.name !== "COMMA") break;

      if (!cursor.nextSibling()) return;
      if (expect_token(["Expr", "else"], "expression or 'else'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    }

    if (!cursor.nextSibling()) return;
    if (expect_token("FAT_ARROW", "'=>'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("RBRACE", "'}'", cursor, previous_node)) return;
  }
  
  function visit_primary(cursor: TreeCursor) {}

  function visit_grouping(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LPAREN
    let previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    if (!cursor.nextSibling()) return;
    if (expect_token("RPAREN", "')'", cursor, previous_node)) return;
  }

  function visit_type_identifier(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // type_identifier
    let previous_node = cursor.node.cursor();
    if (cursor.name === "Type_identifier") {
      if (!cursor.nextSibling()) return; // LBRACKET
      previous_node = cursor.node.cursor();

      if (!cursor.nextSibling()) return;
      if (expect_token("RBRACKET", "']'", cursor, previous_node)) return;
    }
  }

  function get_text(cursor: TreeCursor): string {
    return context.state.sliceDoc(cursor.from, cursor.to);
  }

  function expect_token(token: string | string[], token_in_english: string, cursor: TreeCursor, previous_node: TreeCursor): boolean {
    const tokens = Array.isArray(token) ? token : [token];
    
    if (!token.includes(cursor.name)) {
      diagnostics.push({
        from: previous_node.from,
        to: previous_node.to,
        severity: "warning",
        message: `Expected ${token_in_english} after '${get_text(previous_node)}'`,
      });
      return true;
    }

    return false;
  }
});