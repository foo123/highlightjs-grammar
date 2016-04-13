function highlightjs_grammar_demo(code, langs)
{
    document.getElementById('editor-version').innerHTML = '9.2.0';
    document.getElementById('grammar-version').innerHTML = HighlightJSGrammar.VERSION;
    var main_lang, main_mode;
    for(var i=0,l=langs.length; i<l; i++)
    {
        if ( 0 === i )
        {
            // main mode
            main_lang = langs[i].language;
            main_mode = HighlightJSGrammar.getMode( langs[i].grammar );
        }
        else
        {
            // submodes
            main_mode.submode( langs[i].language, HighlightJSGrammar.getMode( langs[i].grammar ) );
        }
    }
    hljs.registerLanguage( main_lang, main_mode );
    hljs.highlightBlock( code );
}