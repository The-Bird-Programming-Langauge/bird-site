import { styleTags, tags as t } from "@lezer/highlight"
import { HighlightStyle } from "@codemirror/language"

// Assigns tags to the objects created in the parser.
// Tags of the same type are colored the same.
export const taggedSyntax = styleTags({
    "if print while for return break continue as match": t.keyword,
    "var const type fn struct": t.definitionKeyword,

    "int float bool str void": t.typeName,
    "true false": t.bool,

    DOT: t.operator,
    QUESTION: t.operator,
    COLON: t.operator,
    COMMA: t.operator,
    SEMICOLON: t.operator,
    ARROW: t.operator,
    FAT_ARROW: t.operator,
    MINUS: t.operator,
    PLUS: t.operator,
    STAR: t.operator,
    SLASH: t.operator,
    PERCENT: t.operator,
    GREATER: t.operator,
    GREATER_EQUAL: t.operator,
    LESS: t.operator,
    LESS_EQUAL: t.operator,
    EQUAL_EQUAL: t.operator,
    BANG_EQUAL: t.operator,
    EQUAL: t.operator,
    PLUS_EQUAL: t.operator,
    MINUS_EQUAL: t.operator,
    STAR_EQUAL: t.operator,
    SLASH_EQUAL: t.operator,
    PERCENT_EQUAL: t.operator,
    "not": t.operator,

    LPAREN: t.paren,
    RPAREN: t.paren,
    LBRACE: t.brace,
    RBRACE: t.brace,
    LBRACKET: t.squareBracket,
    RBRACKET: t.squareBracket,

    IDENTIFIER: t.variableName,
    NUMBER: t.number,
    STR_LITERAL: t.string,

    SINGLELINE_COMMENT: t.comment,
    MULTILINE_COMMENT: t.comment,
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

    {tag: t.variableName, class: "text-sky-200"},
    {tag: t.number, class: "text-yellow-300"},
    {tag: t.string, class: "text-orange-300"},

    {tag: t.comment, class: "text-gray-400"},
])