var gulp = require( 'gulp' );

/**
 * nw.js のビルドを実行します。
 *
 * @return {Object} ストリーム。
 */
gulp.task( 'nw', function() {
    var $         = require( 'gulp-load-plugins' )();
    var config    = require( '../config.js' ).nw;
    var NWBuilder = require( 'node-webkit-builder' );
    var builder   = new NWBuilder( config.builder );
 
    builder.on( 'log', function( message ) {
        $.util.log( 'node-webkit-builder', message );
    } );

    return builder.build().catch( function( err ) {
        $.util.log( 'node-webkit-builder', err );
    } );
} );