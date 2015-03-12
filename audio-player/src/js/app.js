
onload = function() {
    global.document  = window.document;
    global.navigator = window.navigator;

    var main = require( './vm/main.jsx' )( 'body' );
    main.load();
};
