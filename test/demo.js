function highlightjs_grammar_demo(code, lang, grammar)
{
    document.getElementById('editor-version').innerHTML = '9.2.0';
    document.getElementById('grammar-version').innerHTML = HighlightJSGrammar.VERSION;
    hljs.registerLanguage( lang, HighlightJSGrammar.getMode( grammar ) );
    hljs.highlightBlock( code );
}