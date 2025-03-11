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
    if (!cursor.firstChild()) return; // LBRACE
    const lbrace_node = cursor.node.cursor();

    while (cursor.nextSibling() && cursor.name !== "RBRACE") {}
    if (cursor.name !== "RBRACE") {
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

    cursor.nextSibling();
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (cursor.name as string === "COLON") {
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
    }
    
    if (expect_token(["EQUAL", "COLON"], "'=' or ':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }

  function visit_expr_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());
  }

  function visit_print_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // print
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    while (cursor.nextSibling()) {
      if (cursor.name === "COMMA") {
        previous_node = cursor.node.cursor();

        cursor.nextSibling();
        if (expect_token("Expr", "expression", cursor, previous_node)) return;
        visit_expr(cursor.node.cursor());
        previous_node = cursor.node.cursor();

        cursor.nextSibling();
      }
      
      if (expect_token(["COMMA", "SEMICOLON"], "',' or ';'", cursor, previous_node)) return;
    } 
  }
  
  function visit_const_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // const
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("IDENTIFIER", "identifier", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (cursor.name as string === "COLON") {
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
      if (expect_token("Type_identifier", "type identifier", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
    }
    
    if (expect_token(["EQUAL", "COLON"], "'=' or ':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }
  
  function visit_while_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // while
    let previous_node = cursor.node.cursor();
    
    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Block", "block", cursor, previous_node)) return;
    visit_block(cursor.node.cursor());
  }
  
  function visit_for_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // for
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (cursor.name === "Block_valid_stmt") {
      visit_stmt(cursor.node.cursor());
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "SEMICOLON") {
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Block_valid_stmt", "SEMICOLON"], "statement or ';'", cursor, previous_node)) return;
    }

    cursor.nextSibling();
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
      if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
      previous_node = cursor.node.cursor();
    } else if (cursor.name === "SEMICOLON") {
      previous_node = cursor.node.cursor();
    } else {
      if (expect_token(["Expr", "SEMICOLON"], "expression or ';'", cursor, previous_node)) return;
    }

    cursor.nextSibling();
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
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

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Block", "block", cursor, previous_node)) return;
    visit_block(cursor.node.cursor());
    previous_node = cursor.node.cursor();
  
    if (!cursor.nextSibling()) return; // else
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
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

    cursor.nextSibling();
    if (cursor.name === "Expr") {
      visit_expr(cursor.node.cursor());
      previous_node = cursor.node.cursor();

      cursor.nextSibling();
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

    cursor.nextSibling();
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
  }
  
  function visit_continue_stmt(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // continue
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("SEMICOLON", "';'", cursor, previous_node)) return;
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
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }
  
  function visit_primary(cursor: TreeCursor) {}
  
  function visit_ternary_expr(cursor: TreeCursor) {
    if (cursor.firstChild()) return; // Expr
    visit_expr(cursor.node.cursor());

    if (cursor.nextSibling()) return; // QUESTION
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("COLON", "':'", cursor, previous_node)) return;
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }
  
  function visit_assign_expr(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // Primary

    if (cursor.nextSibling()) return; // EQUAL
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
  }

  function visit_grouping(cursor: TreeCursor) {
    if (!cursor.firstChild()) return; // LPAREN
    let previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("Expr", "expression", cursor, previous_node)) return;
    visit_expr(cursor.node.cursor());
    previous_node = cursor.node.cursor();

    cursor.nextSibling();
    if (expect_token("RPAREN", "')'", cursor, previous_node)) return;
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