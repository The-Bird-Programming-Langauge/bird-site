// Creates a list of auto completions based on the current word being typed out.
// Auto completions include keywords, types, and identifiers.

import { TreeCursor } from "@lezer/common";
import { syntaxTree } from "@codemirror/language"
import { CompletionContext, autocompletion } from "@codemirror/autocomplete"

// Function wrapper.
export const auto_completer = autocompletion({
  override: [get_auto_completions]
});

// Returns a list of possible auto completions based on the editor context.
export function get_auto_completions(context: CompletionContext) {
  // Retrieve the character stream (word) being written.
  let word = context.matchBefore(/\w*/);

  // Ignore anything that is not a character stream for tab completion.
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  // Retrieve all identifier nodes from the tree
  let identifierNodes = find_nodes_of_type(context, "IDENTIFIER");
  let identifierOptions = identifierNodes
    // Avoid adding the current identifier being written as an auto completion
    // by checking if the current word and the identifer overlap.
    .filter(identifierNode => !(identifierNode.from <= word.from && identifierNode.to >= word.to))
    // Create an auto completion object from the identifier node.
    .map(identifierNode => ({
      label: context.state.sliceDoc(identifierNode.from, identifierNode.to),
      type: "variable"
    }));

  return {
    from: word.from,
    options: [
      {label: "if", type: "keyword"},
      {label: "else", type: "keyword"},
      {label: "print", type: "keyword"},
      {label: "while", type: "keyword"},
      {label: "for", type: "keyword"},
      {label: "in", type: "keyword"},
      {label: "return", type: "keyword"},
      {label: "break", type: "keyword"},
      {label: "continue", type: "keyword"},
      {label: "match", type: "keyword"},
      {label: "var", type: "keyword"},
      {label: "const", type: "keyword"},
      {label: "type", type: "keyword"},
      {label: "fn", type: "keyword"},
      {label: "struct", type: "keyword"},
      {label: "namespace", type: "keyword"},
      {label: "import", type: "keyword"},
      {label: "from", type: "keyword"},

      {label: "int", type: "type"},
      {label: "float", type: "type"},
      {label: "bool", type: "type"},
      {label: "str", type: "type"},
      {label: "void", type: "type"},

      ...identifierOptions,
    ]
  }
}

// Traverses every node in the tree and returns a list of nodes of the specified type.
function find_nodes_of_type(context: CompletionContext, typeName: string) {
  let tree = syntaxTree(context.state);
  let nodes: Array<any> = [];

  // Traverses every node of the tree.
  function preorder_traversal(cursor: TreeCursor) {
    // Visit the current node. Add it if it is of the correct type.
    if (cursor.name === typeName) {
      nodes.push({
        from: cursor.from,
        to: cursor.to,
        name: cursor.name
      });
    }

    // Continue traversal.
    if (cursor.firstChild()) {
      do {
        preorder_traversal(cursor);
      } while (cursor.nextSibling());
      cursor.parent();
    }
  }

  let cursor = tree.cursor();
  preorder_traversal(cursor);

  return nodes;
}