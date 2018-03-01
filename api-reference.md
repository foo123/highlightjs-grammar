

### HighlightJSGrammar Methods

__For node:__

```javascript
HighlightJSGrammar = require('build/highlightjs_grammar.js');
```

__For browser:__

```html
<script src="build/highlightjs_grammar.js"></script>
```




__Method__: `clone`

```javascript
cloned_grammar = HighlightJSGrammar.clone( grammar [, deep=true] );
```

Clone (deep) a `grammar`

Utility to clone objects efficiently
    


__Method__: `extend`

```javascript
extended_grammar = HighlightJSGrammar.extend( grammar, basegrammar1 [, basegrammar2, ..] );
```

Extend a `grammar` with `basegrammar1`, `basegrammar2`, etc..

This way arbitrary `dialects` and `variations` can be handled more easily
    


__Method__: `pre_process`

```javascript
pre_processed_grammar = HighlightJSGrammar.pre_process( grammar );
```

This is used internally by the `HighlightJSGrammar` Class `parse` method
In order to pre-process a `JSON grammar` (in-place) to transform any shorthand configurations to full object configurations and provide defaults.
It also parses `PEG`/`BNF` (syntax) notations into full (syntax) configuration objects, so merging with other grammars can be easier if needed.
    


__Method__: `parse`

```javascript
parsed_grammar = HighlightJSGrammar.parse( grammar );
```

This is used internally by the `HighlightJSGrammar` Class
In order to parse a `JSON grammar` to a form suitable to be used by the syntax-highlighter.
However user can use this method to cache a `parsedgrammar` to be used later.
Already parsed grammars are NOT re-parsed when passed through the parse method again
    


__Method__: `getMode`

```javascript
mode = HighlightJSGrammar.getMode( grammar, hljs );
```

This is the main method which transforms a `JSON grammar` into a syntax-highlighter language for `HighlightJS` (`hljs`).
    


__Parser Class__: `Parser`

```javascript
Parser = HighlightJSGrammar.Parser;
```

The Parser Class used to instantiate a highlight parser, is available.
The `getMode` method will instantiate this parser class, which can be overriden/extended if needed, as needed.
In general there is no need to override/extend the parser, unless you definately need to.
    