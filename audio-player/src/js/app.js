
onload = function() {
    global.document  = window.document;
    global.navigator = window.navigator;

    require( './vm/AudioPlayerApp.jsx' )( 'body' );
};
