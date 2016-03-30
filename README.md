highlightjs-grammar
=============


__Transform a JSON grammar into a syntax-highlight mode for Highlight.js__

A simple and light-weight (~ 31kB minified, ~ 11kB zipped) [Highlight.js](https://github.com/isagalaev/highlight.js) add-on

to generate highlightjs-compatible modes from a grammar specification in JSON format.

See also:  [codemirror-grammar](https://github.com/foo123/codemirror-grammar), [ace-grammar](https://github.com/foo123/ace-grammar), [prism-grammar](https://github.com/foo123/prism-grammar), [syntaxhighlighter-grammar](https://github.com/foo123/syntaxhighlighter-grammar)

**Note:** The invariant codebase for all the `*-grammar` add-ons resides at [editor-grammar](https://github.com/foo123/editor-grammar) repository (used as a `git submodule`)


###Contents

* [Live Example (to be added)](http://foo123.github.io/examples/highlightjs-grammar)
* [Todo](#todo)
* [Features](#features)
* [How To use](#how-to-use)
* [API Reference](/api-reference.md)
* [Grammar Reference](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md)


[![Build your own syntax-highlight mode on the fly](/test/screenshot.png)](http://foo123.github.io/examples/highlightjs-grammar)


###Todo

see [Modularity and Future Directions](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#modularity-and-future-directions)

* enable grammar add-on to pre-compile a grammar specification directly into mode source code, so it can be used without the add-on as standalone mode [TODO, maybe]


###Features

* A [`Grammar`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md) can **extend other `Grammars`** (so arbitrary `variations` and `dialects` can be handled more easily)
* `Grammar` includes: [`Style Model`](/https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#style-model) , [`Lex Model`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#lexical-model) and [`Syntax Model` (optional)](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#syntax-model), plus a couple of [*settings*](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#extra-settings) (see examples)
* **`Grammar` specification can be minimal**, defaults will be used (see example grammars)
* [`Grammar.Syntax Model`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#syntax-model) can enable highlight in a more *context-specific* way, plus detect possible *syntax errors*
* [`Grammar.Syntax Model`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#syntax-model) can contain **recursive references**
* [`Grammar.Syntax Model`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#syntax-pegbnf-like-notations) can be (fully) specificed using [`PEG`](https://en.wikipedia.org/wiki/Parsing_expression_grammar)-like notation or [`BNF`](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_Form)-like notation  (**NEW feature**)
* [`Grammar.Syntax Model`](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#syntax-pegbnf-like-notations) implements **positive / negative lookahead tokens** (analogous to `PEG` `and-`/`not-` entities)  (**NEW feature**)
* `Grammar` can define [*action* tokens](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#action-tokens) to perform *complex context-specific* parsing functionality, including **associated tag matching** and **duplicate identifiers** (see for example `xml.grammar` example) (**NEW feature**)
* Generated highlighters are **optimized for speed and size**
* Can generate a syntax-highlighter from a grammar **interactively and on-the-fly** ( see example, http://foo123.github.io/examples/highlightjs-grammar )
* see also [Modularity and Future Directions](https://github.com/foo123/editor-grammar/blob/master/grammar-reference.md#modularity-and-future-directions)


###How to use:

An example for XML:

```javascript
// 1. a partial xml grammar in simple JSON format
var xml_grammar = {
    
// prefix ID for regular expressions, represented as strings, used in the grammar
"RegExpID"                          : "RE::",

// Style model
"Style"                             : {
    
     "declaration"                  : "section"
    ,"doctype"                      : "template-tag"
    ,"meta"                         : "meta"
    ,"comment"                      : "comment"
    ,"cdata"                        : "literal"
    ,"atom"                         : "literal"
    ,"tag"                          : "meta"
    ,"attribute"                    : "built_in"
    ,"string"                       : "string"
    ,"number"                       : "number"

},

// Lexical model
"Lex"                               : {
     
     "comment:comment"              : ["<!--", "-->"]
    ,"declaration:block"            : ["<?xml", "?>"]
    ,"doctype:block"                : ["RE::/<!doctype\\b/i", ">"]
    ,"meta:block"                   : ["RE::/<\\?[_a-zA-Z][\\w\\._\\-]*/", "?>"]
    ,"cdata:block"                  : ["<![CDATA[", "]]>"]
    ,"open_tag"                     : "RE::/<([_a-zA-Z][_a-zA-Z0-9\\-]*)/"
    ,"close_tag"                    : "RE::/<\\/([_a-zA-Z][_a-zA-Z0-9\\-]*)>/"
    ,"attribute"                    : "RE::/[_a-zA-Z][_a-zA-Z0-9\\-]*/"
    ,"string:line-block"            : [["\""], ["'"]]
    ,"number"                       : ["RE::/[0-9]\\d*/", "RE::/#[0-9a-fA-F]+/"]
    ,"atom"                         : ["RE::/&#x[a-fA-F\\d]+;/", "RE::/&#[\\d]+;/", "RE::/&[a-zA-Z][a-zA-Z0-9]*;/"]
    ,"text"                         : "RE::/[^<&]+/"
    
    // actions
    ,"tag_ctx:action"               : {"context":true}
    ,"\\tag_ctx:action"             : {"context":false}
    ,"unique_id:action"             : {"unique":["xml", "$1"],"msg":"Duplicate id value \"$0\""}
    ,"unique_att:action"            : {"unique":["tag", "$0"],"msg":"Duplicate attribute \"$0\"","in-context":true}
    ,"tag_opened:action"            : {"push":"<$1>","ci":true}
    ,"tag_closed:action"            : {"pop":"<$1>","ci":true,"msg":"Tags \"$0\" and \"$1\" do not match"}
    ,"tag_autoclosed:action"        : {"pop":null}
    ,"out_of_place:error"           : "\"$2$3\" can only be at the beginning of XML document"
    
},
    
// Syntax model (optional)
"Syntax"                            : {
     
     "tag_att"                      : "'id'.attribute unique_att '=' string unique_id | attribute unique_att '=' (string | number)"
    ,"start_tag"                    : "open_tag.tag tag_ctx tag_opened tag_att* ('>'.tag | '/>'.tag tag_autoclosed) \\tag_ctx"
    ,"end_tag"                      : "close_tag.tag tag_closed"
    ,"xml"                          : "(^^1 declaration? doctype?) (declaration.error out_of_place | doctype.error out_of_place | comment | meta | cdata | start_tag | end_tag | atom | text)*"
    
},
    
// what to parse and in what order
"Parser"                            : [ ["xml"] ]

};

// 2. parse the grammar into a Highlight.js-compatible mode
var xml_mode = HighlightJSGrammar.getMode( xml_grammar );

// 3. use it with Highlight.js
hljs.registerLanguage( "xml", xml_mode );
hljs.highlightBlock( document.getElementById("code") );


```


Result:

![xml-grammar](/test/grammar-xml.png)
