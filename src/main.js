/**
*
*   HighlightJSGrammar
*   @version: @@VERSION@@
*
*   Transform a grammar specification in JSON format, into a syntax-highlight language for HighlightJS
*   https://github.com/foo123/highlightjs-grammar
*   https://github.com/foo123/editor-grammar
*
**/


//
// parser factories
var HighlightJSParser = Class(Parser, {
    constructor: function HighlightJSParser( grammar, DEFAULT ) {
        var self = this;
        Parser.call(self, grammar, null, null);
        self.DEF = DEFAULT || self.$DEF;
        self.ERR = /*grammar.Style.error ||*/ self.$ERR;
    }
    
    ,tokenize: function( stream, mode, row, tokens ) {
        var self = this, token, buf = [], id = null, push = Array.prototype.push,
            plain_token = function( t ){ t.type = self.$DEF; return t; };
        tokens = tokens || [];
        //mode.state.line = row || 0;
        if ( stream.eol() ) { mode.state.line++; if ( mode.state.$blank$ ) mode.state.bline++; }
        else while ( !stream.eol() )
        {
            token = mode.parser.get( stream, mode );
            if ( mode.state.$actionerr$ )
            {
                if ( buf.length ) push.apply( tokens, map( buf, plain_token ) );
                token.type = self.$DEF; tokens.push( token );
                buf.length = 0; id = null;
            }
            else
            {
                if ( id !== token.name )
                {
                    if ( buf.length ) push.apply( tokens, buf );
                    buf.length = 0; id = token.name;
                }
                buf.push( token );
            }
        }
        if ( buf.length ) push.apply( tokens, buf );
        buf.length = 0; id = null;
        return tokens;
    }
});


function get_mode( grammar, hljs ) 
{
    var HighlightJSMode = function HighlightJSMode( hljs ) {
        var tokens = null, token = null,
            
            mode,
            
            matchToken = {
                lastIndex   : 0,
                exec        : function( str ) {
                    var m = null;
                    if ( token )
                    {
                        m = [token.token];
                        m.index = 0;
                        this.lastIndex = m[0].length;
                    }
                    return m;
                }
            },
            
            getToken = {
                lastIndex   : 0,
                exec        : function( str ) {
                    var m = null;
                    if ( token && !token.ret )
                    {
                        m = [token.token];
                        m.index = 0;
                        this.lastIndex = m[0].length;
                        // returned, reset it
                        token.ret = 1;
                    }
                    return m;
                }
            },
            
            parseToken = {
                _str        : null,
                lastIndex   : 0,
                exec        : function( str ) {
                    var m = null, self = this;
                    if ( str !== self._str )
                    {
                        self._str = str;
                        self.lastIndex = self.lastIndex || 0;
                        tokens = HighlightJSMode.$parser.parse(str, TOKENS|ERRORS|FLAT).tokens;
                        token = tokens.shift( );
                        token.ret = 0;
                        mode.parent = mode;
                        if ( null === token.type )
                        {
                            // unstyled
                            mode.keywords = null;
                        }
                        else
                        {
                            // token.type is the syntax-highlight style
                            mode.keywords = { };
                            mode.keywords[token.token] = [token.type, 1];
                        }
                        m = [token.token];
                        m.index = self.lastIndex;
                        self.lastIndex += m[0].length;
                    }
                    else if ( tokens && tokens.length )
                    {
                        self.lastIndex = self.lastIndex || 0;
                        token = tokens.shift( );
                        token.ret = 0;
                        mode.parent = mode;
                        if ( null === token.type )
                        {
                            // unstyled
                            mode.keywords = null;
                        }
                        else
                        {
                            // token.type is the syntax-highlight style
                            mode.keywords = { };
                            mode.keywords[token.token] = [token.type, 1];
                        }
                        m = [token.token];
                        m.index = self.lastIndex;
                        self.lastIndex += m[0].length;
                    }
                    else
                    {
                        self._str = null;
                        self.lastIndex = 0;
                        tokens = null; token = null;
                        mode.parent = null; mode.keywords = null;
                    }
                    return m;
                }
            }
        ;
        
        mode = {
            Mode: HighlightJSMode,
            // this is supposed to be an already compiled mode
            compiled: true,
            aliases: HighlightJSMode.aliases || null,
            case_insensitive: false,
            relevance: 0,
            contains: [],
            parent: null,
            keywords: null,
            className: null,
            // a hack for hljs to introduce grammar token parsing
            beginRe: matchToken,
            endRe: matchToken,
            lexemesRe: getToken,
            terminators: parseToken,
            submode: function( lang, mode ) {
                HighlightJSMode.submode( lang, mode.Mode );
            }
        };
        return mode;
    };
    
    HighlightJSMode.$id = uuid("highlightjs_grammar_mode");
    HighlightJSMode.$parser = new HighlightJSGrammar.Parser( parse_grammar( grammar ) );
    HighlightJSMode.submode = function( lang, Mode ) {
        HighlightJSMode.$parser.subparser( lang, Mode.$parser );
    };
    HighlightJSMode.dispose = function( ) {
        if ( HighlightJSMode.$parser ) HighlightJSMode.$parser.dispose( );
        HighlightJSMode.$parser = null;
    };
    HighlightJSMode.aliases = null;
    
    return HighlightJSMode;
}


//
//  HighlightJS Grammar main class
/**[DOC_MARKDOWN]
*
* ###HighlightJSGrammar Methods
*
* __For node:__
*
* ```javascript
* HighlightJSGrammar = require('build/highlightjs_grammar.js');
* ```
*
* __For browser:__
*
* ```html
* <script src="build/highlightjs_grammar.js"></script>
* ```
*
[/DOC_MARKDOWN]**/
var HighlightJSGrammar = {
    
    VERSION: "@@VERSION@@",
    
    // clone a grammar
    /**[DOC_MARKDOWN]
    * __Method__: `clone`
    *
    * ```javascript
    * cloned_grammar = HighlightJSGrammar.clone( grammar [, deep=true] );
    * ```
    *
    * Clone (deep) a `grammar`
    *
    * Utility to clone objects efficiently
    [/DOC_MARKDOWN]**/
    clone: clone,
    
    // extend a grammar using another base grammar
    /**[DOC_MARKDOWN]
    * __Method__: `extend`
    *
    * ```javascript
    * extended_grammar = HighlightJSGrammar.extend( grammar, basegrammar1 [, basegrammar2, ..] );
    * ```
    *
    * Extend a `grammar` with `basegrammar1`, `basegrammar2`, etc..
    *
    * This way arbitrary `dialects` and `variations` can be handled more easily
    [/DOC_MARKDOWN]**/
    extend: extend,
    
    // pre-process a grammar (in-place)
    /**[DOC_MARKDOWN]
    * __Method__: `pre_process`
    *
    * ```javascript
    * pre_processed_grammar = HighlightJSGrammar.pre_process( grammar );
    * ```
    *
    * This is used internally by the `HighlightJSGrammar` Class `parse` method
    * In order to pre-process a `JSON grammar` (in-place) to transform any shorthand configurations to full object configurations and provide defaults.
    * It also parses `PEG`/`BNF` (syntax) notations into full (syntax) configuration objects, so merging with other grammars can be easier if needed.
    [/DOC_MARKDOWN]**/
    pre_process: preprocess_and_parse_grammar,
    
    // parse a grammar
    /**[DOC_MARKDOWN]
    * __Method__: `parse`
    *
    * ```javascript
    * parsed_grammar = HighlightJSGrammar.parse( grammar );
    * ```
    *
    * This is used internally by the `HighlightJSGrammar` Class
    * In order to parse a `JSON grammar` to a form suitable to be used by the syntax-highlighter.
    * However user can use this method to cache a `parsedgrammar` to be used later.
    * Already parsed grammars are NOT re-parsed when passed through the parse method again
    [/DOC_MARKDOWN]**/
    parse: parse_grammar,
    
    // get an SyntaxHighlighter-compatible brush from a grammar
    /**[DOC_MARKDOWN]
    * __Method__: `getMode`
    *
    * ```javascript
    * mode = HighlightJSGrammar.getMode( grammar, hljs );
    * ```
    *
    * This is the main method which transforms a `JSON grammar` into a syntax-highlighter language for `HighlightJS` (`hljs`).
    [/DOC_MARKDOWN]**/
    getMode: get_mode,
    
    // make Parser class available
    /**[DOC_MARKDOWN]
    * __Parser Class__: `Parser`
    *
    * ```javascript
    * Parser = HighlightJSGrammar.Parser;
    * ```
    *
    * The Parser Class used to instantiate a highlight parser, is available.
    * The `getMode` method will instantiate this parser class, which can be overriden/extended if needed, as needed.
    * In general there is no need to override/extend the parser, unless you definately need to.
    [/DOC_MARKDOWN]**/
    Parser: HighlightJSParser
};
