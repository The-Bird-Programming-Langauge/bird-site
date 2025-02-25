// Helper functions for the parser.

import { LRLanguage } from "@codemirror/language"
import { LanguageSupport } from "@codemirror/language"
import { parser } from "./parser.js"

// Returns a LanguageSupport object which is an extension for a code mirror editor.
// This object performs parsing and syntax highlighting for the editor.
export function getLanguageSupport() {
    return new LanguageSupport(
        LRLanguage.define({
            parser: parser.configure({})
        })
    )
}

// Print AST.
export function printAST(code) {
    console.log(parser.parse(code).toString())
}