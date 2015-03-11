var gulp = require( 'gulp' );

/**
 * SVG からアイコン フォントを生成します。
 *
 * @return {Object} ストリーム。
 */
gulp.task( 'iconfont', function() {
    var $      = require( 'gulp-load-plugins' )();
    var config = require( '../config.js' ).iconfont;

    return gulp.src( 'src/icons/*.svg' )
        .pipe( $.iconfont( { fontName: config.name } ) )
        .on( 'codepoints', function( codepoints ) { template( $, config, codepoints ); } )
        .pipe( gulp.dest( config.dest ) );
} );

/**
 * テンプレートを処理します。
 * CSS テンプレート設定があれば、アイコン フォントを利用するための CSS ファイルを出力します。
 * CSS/HTML テンプレート設定があれば、アイコン フォント一覧 HTML ファイルを出力します。
 *
 * @param {Object} $          gulp 関連モジュール参照用オブジェクト。
 * @param {Object} config     タスク設定。
 * @param {Object} codepoints フォント情報。
 */
function template( $, config, codepoints ) {
    // テンプレート設定はオプション扱い
    if( !( config.template ) ) { return; }

    var options = {
        className: config.name,
        fontName:  config.name,
        fontPath:  config.template.css.ref,
        cssFile:   config.template.html.ref,
        glyphs:    codepoints
    };

    // CSS
    if( config.template.css ) {
        gulp.src( config.template.css.src )
            .pipe( $.consolidate( 'lodash', options ) )
            .pipe( $.rename( { basename: config.template.css.name } ) )
            .pipe( gulp.dest( config.template.css.dest ) );
    }

    // フォント一覧 HTML ( CSS も必要 )
    if( config.template.css && config.template.html ) {
        gulp.src( config.template.html.src )
            .pipe( $.consolidate( 'lodash', options ) )
            .pipe( $.rename( { basename: config.template.html.name }))
            .pipe( gulp.dest( config.template.html.dest ) );
    }
}
