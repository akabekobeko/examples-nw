var gulp = require( 'gulp' );
var $    = require( 'gulp-load-plugins' )();

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 * このタスクは開発用で、JavaScript は Minify されません。
 * Minify するとデバッガで Source Maps を展開したとき、変数名を復元できず不便なので開発時はそのまま結合します。
 *
 * @return {Object} ストリーム。
 */
gulp.task( 'js', function() {
    return compile( false );
} );

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 * このタスクはリリース用で、JavaScript は Minify されます。
 *
 * @return {Object} ストリーム。
 */
gulp.task( 'js-release', function() {
    return compile( true );
} );

/**
 * JavaScript の変更を監視して差分コンパイルします。
 *
 * @return {Object} ストリーム。
 */
gulp.task( 'watchify', function() {
    return compile( false, true );
} );

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 *
 * @param {Boolean} isMinify 圧縮を有効にする場合は true。
 * @param {Boolean} isWatch  差分監視モードで実行する場合は true。
 *
 * @return {Object} ストリーム。
 */
function compile( isUglify, isWatch ) {
    var config     = require( '../config.js' ).js;
    var errorUtil  = require( '../util/error' );
    var browserify = require( 'browserify' );
    var source     = require( 'vinyl-source-stream' );
    var buffer     = require( 'vinyl-buffer' );
    var watchify   = require( 'watchify' );
    var logger     = new bundleLogger( config.src, config.bundle );

    var bundler = null;
    if( isWatch ) {
        var option = config.browserify;
        option.cache        = {};
        option.packageCache = {};
        option.fullPaths    = true;

        bundler = watchify( browserify( config.src, option ) );
        logger.watch();

    } else {
        bundler = browserify( config.src, config.browserify );
    }

    /**
     * Browserify による JavaScript コンパイルを実行します。
     *
     * @return {Object} ストリーム。
     */
    function bundle() {
        logger.begin();
        return bundler
            .bundle()
            .on( 'error', errorUtil )
            .pipe( source( config.bundle ) )
            .pipe( buffer() )
            .pipe( $.sourcemaps.init( { loadMaps: true } ) )
            .pipe( $.if( isUglify, $.uglify() ) )
            .pipe( $.sourcemaps.write( '.' ) )
            .on( 'end', logger.end )
            .pipe( gulp.dest( config.dest ) );
    }

    bundler.on( 'update', bundle );

    return bundle();
}

/**
 * Browserify による JavaScript コンパイルの進捗をコンソールに出力します。
 *
 * @param {String} src    コンパイルの起点となるファイル。
 * @param {String} bundle コンパイル結果となるファイル。
 */
var bundleLogger = function( src, bundle ) {
    var prettyHrtime = require( 'pretty-hrtime' );
    var beginTime;

    this.begin = function() {
        beginTime = process.hrtime();
        $.util.log( 'Bundling', $.util.colors.green( src ) + '...' );
    };

    this.watch = function() {
        $.util.log( 'Watching files required by', $.util.colors.yellow( src ) );
    };

    this.end = function() {
        var taskTime   = process.hrtime( beginTime );
        var prettyTime = prettyHrtime( taskTime );
        $.util.log( 'Bundled', $.util.colors.green( bundle ), 'in', $.util.colors.magenta( prettyTime ) );
    };
};
