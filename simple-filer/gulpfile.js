var gulp = require( 'gulp' );
var $    = require( 'gulp-load-plugins' )();

/**
 * JavaScript と JSX ファイルをコンパイルした単一ファイルを開発フォルダに出力します。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'js', function() {
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
        .pipe( $.replace( 'require', 'requireClient' ) )
        .pipe( $.replace( 'nequire', 'require' ) )
        //.pipe( $.uglify() )
        .pipe( $.sourcemaps.write( './' ) )
        .pipe( gulp.dest( 'src/js' ) );
} );

/**
 * リリース用イメージを削除します。
 *
 * @param {Function} cb コールバック関数。
 */
gulp.task( 'clean', function( cb ) {
    var del = require( 'del' );
    del( [ 'release/bin/', 'release/src/' ], cb );
} );

/**
 * HTML 内のリソース参照情報を解決し、リリース用フォルダに HTML/CSS/JS を出力します。
 *
 * 対象となる JavaScript は Bower 経由でインストールしたライブラリです。
 * node-webkit のグローバルな require と競合せぬよう、このタスクで処理します。
 * 自作スクリプトは js タスクで処理されます。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'useref', [ 'clean' ], function() {
    var assets = $.useref.assets();
    return gulp.src( 'src/*.html' )
        .pipe( assets )
        .pipe( $.if( '*.css', $.minifyCss() ) )
        .pipe( assets.restore() )
        .pipe( $.useref() )
        .pipe( gulp.dest( 'release/src' ) );
} );

/**
 * リリース用イメージに必要なファイルをコピーします。
 */
gulp.task( 'copy', [ 'js', 'useref' ], function() {
    return gulp.src(
            [ 'src/fonts/**', 'src/js/app.js', 'src/package.json' ],
            { base: 'src' }
        )
        .pipe( gulp.dest( 'release/src' ) );
} );

/**
 * node-webkit イメージを生成します。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'release', [ 'copy' ], function () {
    var builder = require( 'node-webkit-builder' );
 
    var nw = new builder( {
        version: '0.11.5',
        files: [ 'release/src/**' ],
        buildDir: 'release/bin',
        cacheDir: 'release/nw',
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
gulp.task( 'watch', [ 'js' ], function () {
    gulp.watch( [ 'src/js/*.js', '!src/js/app.js' ], [ 'js' ]);
} );

/**
 * gulp の既定タスクです。
 */
gulp.task( 'default', [ 'js' ] );
