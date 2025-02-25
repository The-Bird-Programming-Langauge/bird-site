import { syntaxTree } from "@codemirror/language"

export function autoCompletions(context) {
    let word = context.matchBefore(/\w*/);
    console.log(word.from + " " + word.to);

    if (word.from == word.to && !context.explicit) {
        return null;
    }

    let identifiers = findNodesOfType(context.state, "IDENTIFIER");
    let identifierOptions = identifiers
        .filter(node => !(node.from <= word.from && node.to >= word.to)) // Exclude current word
        .map(node => ({
            label: context.state.sliceDoc(node.from, node.to),
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
            {label: "return", type: "keyword"},
            {label: "break", type: "keyword"},
            {label: "continue", type: "keyword"},
            {label: "match", type: "keyword"},
            {label: "var", type: "keyword"},
            {label: "const", type: "keyword"},
            {label: "type", type: "keyword"},
            {label: "fn", type: "keyword"},
            {label: "struct", type: "keyword"},

            {label: "int", type: "type"},
            {label: "float", type: "type"},
            {label: "bool", type: "type"},
            {label: "str", type: "type"},
            {label: "void", type: "type"},

            ...identifierOptions,
        ]
    }
}

function findNodesOfType(state, typeName) {
    let tree = syntaxTree(state);
    let nodes = [];

    function traverse(cursor) {
        if (cursor.name === typeName) {
            nodes.push({
                from: cursor.from,
                to: cursor.to,
                name: cursor.name
            });
        }
        if (cursor.firstChild()) {
            do {
                traverse(cursor);
            } while (cursor.nextSibling());
            cursor.parent();
        }
    }

    let cursor = tree.cursor();
    traverse(cursor);

    return nodes;
}