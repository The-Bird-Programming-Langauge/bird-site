// Performs syntax highlighting by assigning tags to Lexer/Parser objects and applying colors to the tags.
// A HighlightStyle object is created, which can be converted to a codemirror extension.

import { styleTags, tags as t } from "@lezer/highlight"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"

// Specifies the color of each tag.
export const syntax_highlighter = syntaxHighlighting(HighlightStyle.define([
  {tag: t.keyword, class: "text-pink-400"},
  {tag: t.definitionKeyword, class: "text-sky-400"},
  
  {tag: t.typeName, class: "text-green-400"},
  
  {tag: t.bool, class: "text-sky-400"},

  {tag: t.operator, class: "text-white"},

  {tag: t.paren, class: "text-orange-300"},
  {tag: t.squareBracket, class: "text-orange-300"},
  {tag: t.brace, class: "text-orange-300"},

  {tag: t.variableName, class: "text-sky-200"},
  {tag: t.integer, class: "text-yellow-300"},
  {tag: t.float, class: "text-yellow-300"},
  {tag: t.string, class: "text-orange-300"},

  {tag: t.comment, class: "text-gray-400"},
]))

// Assigns tags to the objects created in the parser.
// Tags of the same type are colored the same.
export const taggedSyntax = styleTags({
  "if else print while for in return break continue match import from": t.keyword,
  "var const type fn struct self namespace": t.definitionKeyword,

  "int float bool str void": t.typeName,
  "Type_identifier/IDENTIFIER": t.typeName,

  "true false": t.bool,

  DOT: t.operator,
  QUESTION: t.operator,
  COLON: t.operator,
  COMMA: t.operator,
  SEMICOLON: t.operator,
  ARROW: t.operator,
  FAT_ARROW: t.operator,
  COLON_COLON: t.operator,
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
  "not and or xor as": t.operator,

  LPAREN: t.paren,
  RPAREN: t.paren,
  LBRACE: t.brace,
  RBRACE: t.brace,
  LBRACKET: t.squareBracket,
  RBRACKET: t.squareBracket,

  IDENTIFIER: t.variableName,
  INT_LITERAL: t.integer,
  FLOAT_LITERAL: t.float,
  STR_LITERAL: t.string,

  SINGLELINE_COMMENT: t.comment,
  MULTILINE_COMMENT: t.comment,
})