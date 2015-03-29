
onload = function() {
    global.document  = window.document;
    global.navigator = window.navigator;

    if( window.testDesignMode ) {
        require( './vm/DesignViewModel.js' )( 'body' );
    } else {
        require( './vm/MainViewModel.js' )( 'body' );
    }
};
