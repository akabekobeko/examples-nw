// 汎用タスク定義
require( 'require-dir' )( './gulp/tasks', { recurse: true } );

////////////////////////////////////////////////////////////////////////////////
//                           プロジェクト固有タスク
////////////////////////////////////////////////////////////////////////////////

var gulp = require( 'gulp' );

/**
 * リリース用イメージを削除します。
 *
 * @param {Function} cb コールバック関数。
 */
gulp.task( 'clean', function( cb ) {
    var del = require( 'del' );
    del( [ './bin/src', './bin/release' ], cb );
} );

/**
 * リリース用 CSS と、その参照を解決した HTML を生成します。
 *
 * @return {[type]} [description]
 */
gulp.task( 'css-release', [ 'clean', 'css', ], function() {
    var runSequence = require( 'run-sequence' );
    runSequence( 'useref' );
} );

/**
 * リリース用イメージに必要なファイルをコピーします。
 * 
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'copy', [ 'js-release', 'css-release', 'iconfont' ], function() {
    return gulp.src(
            [ './src/fonts/**', './src/js/bundle.js', 'src/package.json' ],
            { base: './src' }
        )
        .pipe( gulp.dest( './bin/src' ) );
} );

/**
 * ブロジェクトのリリース用イメージを出力します。
 */
gulp.task( 'release', [ 'copy' ], function() {
    var runSequence = require( 'run-sequence' );
    runSequence( 'nw' );
} );

/**
 * 開発用リソースの変更を監視して、必要ならビルドを実行します。
 */
gulp.task( 'watch', [ 'css', 'iconfont', 'watchify' ], function () {
    gulp.watch( [ './src/stylus/*.styl', '!./src/css/*.css' ], [ 'css' ] );
    gulp.watch( [ './icons/*.svg' ], [ 'iconfont' ] );
} );

/**
 * gulp の既定タスクです。
 */
gulp.task( 'default', [ 'watch' ] );
