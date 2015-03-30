import MainViewModel   from './vm/DesignViewModel.js';
import DesignViewModel from './vm/MainViewModel.js';

onload = function() {
    global.document  = window.document;
    global.navigator = window.navigator;

    if( window.testDesignMode ) {
        MainViewModel( 'body' );
    } else {
        DesignViewModel( 'body' );
    }
};
