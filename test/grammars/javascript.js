// 1. a partial javascript grammar in simple JSON format
var js_grammar = {
        
// prefix ID for regular expressions used in the grammar
"RegExpID"                          : "RegExp::",
    
// Style model
"Style"                             : {

     "comment"                      : "comment"
    ,"atom"                         : "literal"
    ,"keyword"                      : "section"
    ,"this"                         : "section"
    ,"builtin"                      : "built_in"
    ,"identifier"                   : "meta"
    ,"property"                     : "variable"
    ,"number"                       : "number"
    ,"string"                       : "string"
    ,"regex"                        : "regexp"

},

// Lexical model
"Lex"                               : {

     "comment"                      : {"type":"comment","tokens":[
                                    // line comment
                                    // start, end delims  (null matches end-of-line)
                                    [  "//",  null ],
                                    // block comments
                                    // start,  end    delims
                                    [  "/*",   "*/" ]
                                    ]}
    ,"identifier"                   : "RegExp::/[_A-Za-z$][_A-Za-z0-9$]*/"
    ,"this"                         : "RegExp::/this\\b/"
    ,"property"                     : "RegExp::/[_A-Za-z$][_A-Za-z0-9$]*/"
    ,"number"                       : [
                                    // floats
                                    "RegExp::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/",
                                    "RegExp::/\\d+\\.\\d*/",
                                    "RegExp::/\\.\\d+/",
                                    // integers
                                    // hex
                                    "RegExp::/0x[0-9a-fA-F]+L?/",
                                    // binary
                                    "RegExp::/0b[01]+L?/",
                                    // octal
                                    "RegExp::/0o[0-7]+L?/",
                                    // decimal
                                    "RegExp::/[1-9]\\d*(e[\\+\\-]?\\d+)?L?/",
                                    // just zero
                                    "RegExp::/0(?![\\dx])/"
                                    ]
    ,"string"                       : {"type":"escaped-block","escape":"\\","tokens":
                                    // start, end of string (can be the matched regex group ie. 1 )
                                    [ "RegExp::/(['\"])/",   1 ]
                                    }
    ,"regex"                        : {"type":"escaped-block","escape":"\\","tokens":
                                    // javascript literal regular expressions can be parsed similar to strings
                                    [ "/",    "RegExp::#/[gimy]{0,4}#" ]
                                    }
    ,"operator"                     : {"tokens":[
                                    "+", "-", "++", "--", "%", ">>", "<<", ">>>",
                                    "*", "/", "^", "|", "&", "!", "~",
                                    ">", "<", "<=", ">=", "!=", "!==",
                                    "=", "==", "===", "+=", "-=", "%=",
                                    ">>=", ">>>=", "<<=", "*=", "/=", "|=", "&="
                                    ]}
    ,"delimiter"                    : {"tokens":[
                                    "(", ")", "[", "]", "{", "}", ",", "=", ";", "?", ":",
                                    "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "++", "--",
                                    ">>=", "<<="
                                    ]}
    ,"atom"                         : {"autocomplete":true,"tokens":[
                                    "true", "false", 
                                    "null", "undefined", 
                                    "NaN", "Infinity"
                                    ]}
    ,"keyword"                      : {"autocomplete":true,"tokens":[ 
                                    "if", "while", "with", "else", "do", "try", "finally",
                                    "return", "break", "continue", "new", "delete", "throw",
                                    "var", "const", "let", "function", "catch", "void",
                                    "for", "switch", "case", "default", "class", "import", "yield",
                                    "in", "typeof", "instanceof"
                                    ]}
    ,"builtin"                      : {"autocomplete":true,"tokens":[ 
                                    "Object", "Function", "Array", "String", 
                                    "Date", "Number", "RegExp", "Math", "Exception",
                                    "setTimeout", "setInterval", "parseInt", "parseFloat", 
                                    "isFinite", "isNan", "alert", "prompt", "console", 
                                    "window", "global", "this"
                                    ]}
    
},
    
// Syntax model (optional)
"Syntax"                            : {

     "dotProperty"                  : {"type":"group","match":"all","tokens":[ ".", "property" ]}
    ,"builtinOrIdentifier"          : {"type":"either","tokens":[
                                    "}", ")", "this", "builtin", "identifier", "dotProperty"
                                    ]}
    ,"dotProperties"                : {"zeroOrMore": ["dotProperty"]}
    ,"identifierWithProperties"     : {"type":"n-gram","tokens":[
                                    [ "builtinOrIdentifier", "dotProperties" ]
                                    ]}

},

// what to parse and in what order
"Parser"                            : [
                                    "comment",
                                    "number",
                                    "string",
                                    "regex",
                                    "keyword",
                                    "operator",
                                    "atom",
                                    "identifierWithProperties"
                                    ]

};
