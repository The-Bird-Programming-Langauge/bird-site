// Helper functions for codemirror.

import { LRLanguage, LanguageSupport, syntaxHighlighting } from "@codemirror/language"
import { autocompletion, acceptCompletion } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { parser } from "./parser/parser.js"
import { syntaxHighlightStyle } from "$lib/codemirror/syntax-highlighter"
import { getAutoCompletions } from "$lib/codemirror/auto-completer"

// Returns a list of extensions that are acceptable by codemirror.
// Extensions add features to codemiror.
export function getExtensions() {
    const keyMapExtensions = Prec.highest(
		keymap.of([
			{ key: "Tab", run: acceptCompletion }, // Make the tab key the tab completion keybind.
		])
	);

    return [
        getLanguageSupport(), // Parse the code and assign tags for syntax highlighting.
        syntaxHighlighting(syntaxHighlightStyle), // Apply color to the tags.
        autocompletion({override: [getAutoCompletions]}), // Apply auto completions based on the coding context.
        keyMapExtensions, // Add any non-default keybinds.
    ]
}

// Returns a LanguageSupport object, which is an extension for a code mirror editor.
// This object performs parsing and syntax highlighting for the editor.
export function getLanguageSupport() {
    return new LanguageSupport(
        LRLanguage.define({
            parser: parser.configure({})
        })
    )
}

// Print the AST generated by the parser.
export function printAST(code) {
    console.log(parser.parse(code).toString())
}