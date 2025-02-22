// This is an old syntax highlighter used for reference.

import { styleTags, tags as t } from "@lezer/highlight"
import { HighlightStyle } from "@codemirror/language"

// Assigns tags to the objects created in the parser.
// Tags of the same type are colored the same.
export const taggedSyntax = styleTags({
    "if print while for return break continue as": t.keyword,
    "var const type fn struct": t.definitionKeyword,
    "int float bool str void": t.typeName,
    "true false": t.bool,

    ASSIGN_OP: t.operator,
    EQUALITY_OP: t.operator,
    COMPARISON_OP: t.operator,
    FACTOR_OP: t.operator,
    TERM_OP: t.operator,
    PREFIX_UNARY_OP_SYMBOL: t.operator,
    "; . , : -> ? not": t.operator,
    "( )": t.paren,
    "[ ]": t.squareBracket,
    "{ }": t.brace,

    SINGLELINE_COMMENT: t.lineComment,
    MULTILINE_COMMENT: t.blockComment,

    IDENTIFIER: t.variableName,
    STR_LITERAL: t.string,
    INT_LITERAL: t.integer,
})

// Specifies the color of each tag.
export const syntaxHighlightStyle = HighlightStyle.define([
    {tag: t.keyword, class: "text-pink-400"},
    {tag: t.definitionKeyword, class: "text-sky-400"},
    {tag: t.typeName, class: "text-green-400"},
    {tag: t.bool, class: "text-sky-400"},

    {tag: t.operator, class: "text-white"},
    {tag: t.paren, class: "text-orange-300"},
    {tag: t.squareBracket, class: "text-orange-300"},
    {tag: t.brace, class: "text-orange-300"},

    {tag: t.lineComment, class: "text-gray-400"},
    {tag: t.blockComment, class: "text-gray-400"},

    {tag: t.variableName, class: "text-sky-200"},
    {tag: t.string, class: "text-orange-300"},
    {tag: t.integer, class: "text-yellow-300"},
])