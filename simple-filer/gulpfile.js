var gulp = require( 'gulp' );
var $    = require( 'gulp-load-plugins' )();

/**
 * リリース用イメージを削除します。
 *
 * @param {Function} cb コールバック関数。
 */
gulp.task( 'clean', require( 'del' ).bind( './dist', './build' ) );

/**
 * リリース用イメージに必要なファイルをコピーします。
 *
 * @param {Function} cb コールバック関数。
 */
gulp.task( 'copy', [ 'clean' ], function( cb ) {
    gulp.src( './src/fonts/**' ).pipe( gulp.dest( './dist/fonts' ) );
    gulp.src( './src/js/app.js' ).pipe( gulp.dest( './dist/js' ) );
    gulp.src( './src/package.json' ).pipe( gulp.dest( './dist' ) );
    gulp.src( './src/bower_components/react/react.js' ).pipe( gulp.dest( './dist/bower_components/react' ) );
    cb();
} );

/**
 * HTML 内のリソース参照情報を元にリリース用 CSS と HTML ファイルを生成します。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'useref', function() {
    var assets = $.useref.assets();
    return gulp.src( './src/*.html' )
        .pipe( assets )
        .pipe( $.if( '*.css', $.minifyCss() ) )
        .pipe( assets.restore() )
        .pipe( $.useref() )
        .pipe( gulp.dest( './dist' ) );
} );

/**
 * プロジェクトの JavaScript と JSX ファイルをビルドします。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'build', function() {
    var browserify = require( 'browserify' );
    var source     = require( 'vinyl-source-stream' );
    var buffer     = require( 'vinyl-buffer' );
 
    return browserify(
            './src/js/main.js',
            {
                debug: true,
                detectGlobals: false,
                builtins: [],
                transform: [ 'reactify' ]
            }
        )
        .bundle()
        .pipe( source( 'app.js' ) )
        .pipe( buffer() )
        .pipe( $.sourcemaps.init( { loadMaps: true } ) )
        .pipe( $.uglify() )
        .pipe( $.sourcemaps.write( './' ) )
        .pipe( gulp.dest( './src/js' ) );
} );

/**
 * node-webkit イメージを生成します。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'release', [ 'copy', 'useref', 'build' ], function () {
    var builder = require( 'node-webkit-builder' );
 
    var nw = new builder( {
        version: '0.11.5',
        files: [ './dist/**' ],
        platforms: [ 'osx' ]
    });
 
    nw.on( 'log', function( message ) {
        $.util.log( 'node-webkit-builder', message );
    } );
 
    return nw.build().catch( function( err ) {
        $.util.log( 'node-webkit-builder', err );
    } );
} );

/**
 * 開発用リソースの変更を監視して、必要ならビルドを実行します。
 */
gulp.task( 'watch', [ 'build' ], function () {
    gulp.watch( [ './src/js/*.js', '!./src/js/app.js' ], [ 'build' ]);
} );

/**
 * gulp の既定タスクです。
 */
gulp.task( 'default', [ 'build' ] );
