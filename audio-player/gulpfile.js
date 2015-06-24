var gulp = require( 'gulp' );
var $    = require( 'gulp-load-plugins' )();

// 共通タスク設定
var common = {
  src:        './src',
  dest:       './release',
  test:       './test',
  isWatchify: false,
  isUglify:   false
};

// browserify タスクのファイル監視モード実行フラグを有効化
gulp.task( 'browserify-watchfy', function( done ) { common.isWatchify = true; done(); } );

// browserify タスクの圧縮・最適化モード実行フラグを有効化
gulp.task( 'browserify-uglify', function( done ) { common.isUglify = true; done(); } );

// JavaScript 間の依存解決とコンパイルを実行し、その結果を単一のファイルとして出力する
gulp.task( 'browserify', $.watchify( function( watchify ) {
  var buffer    = require( 'vinyl-buffer' );
  var formatter = require( 'pretty-hrtime' );
  var time      = process.hrtime();

  return gulp.src( [ common.src + '/js/App.js' ] )
    .pipe( $.plumber() )
    .pipe( watchify( {
      watch: common.isWatchify,
      basedir:   './',
      debug:     true,
      transform: [ 'babelify' ]
    } ) )
    .pipe( buffer() )
    .pipe( $.sourcemaps.init( { loadMaps: true } ) )
    .pipe( $.if( common.isUglify, $.uglify() ) )
    .pipe( $.rename( 'bundle.js' ) )
    .pipe( $.sourcemaps.write( './' ) )
    .pipe( gulp.dest( common.src ) )
    .on( 'end', function() {
      var taskTime = formatter( process.hrtime( time ) );
      $.util.log( 'Bundled', $.util.colors.green( 'bundle.js' ), 'in', $.util.colors.magenta( taskTime ) );
    } );
} ) );

// Stylus コンパイルと結合
gulp.task( 'stylus', function() {
  return gulp.src( [
      common.src + '/stylus/App.styl',
      common.src + '/stylus/MusicList.styl',
      common.src + '/stylus/Toolbar.styl',
      common.src + '/stylus/Icon.styl'
    ] )
    .pipe( $.plumber() )
    .pipe( $.sourcemaps.init() )
    .pipe( $.stylus() )
    .pipe( $.concat( 'bundle.css' ) )
    .pipe( $.minifyCss() )
    .pipe( $.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( common.src ) );
} );

// アイコン フォント生成
gulp.task( 'iconfont', function() {
  return gulp.src( common.src + '/icons/*.svg' )
    .pipe( $.iconfont( { fontName: 'icon' } ) )
    .on( 'codepoints', function( codepoints ) {
      var options = {
        className: 'icon',
        fontName:  'icon',
        fontPath:  'fonts/',
        cssFile:   'icon.css',
        glyphs:    codepoints
      };

      // Stylus
      gulp.src( common.src + '/icons/template.styl' )
        .pipe( $.consolidate( 'lodash', options ) )
        .pipe( $.rename( { basename: 'Icon' } ) )
        .pipe( gulp.dest( common.src + '/stylus' ) );

      // CSS ( 出力見本用 )
      gulp.src( common.src + '/icons/template.css' )
        .pipe( $.consolidate( 'lodash', options ) )
        .pipe( $.rename( { basename: 'icon' } ) )
        .pipe( gulp.dest( common.src ) );

      // フォント出力見本 HTML ( CSS も必要 )
      gulp.src( common.src + '/icons/template.html' )
        .pipe( $.consolidate( 'lodash', options ) )
        .pipe( $.rename( { basename: 'icon-sample' } ) )
        .pipe( gulp.dest( common.src ) );
    } )
    .pipe( gulp.dest( common.src + '/fonts' ) );
} );

// アイコンフォントも含めた Stylus コンパイルと結合
// これらは依存関係があるものの、watch の兼ね合いでタスクとしては依存設定したくない
gulp.task( 'stylus-with-iconfont', [ 'iconfont' ], function( done ) {
  var runSequence = require( 'run-sequence' );
  runSequence( 'stylus' );
  done();
} );

// リリース用イメージ削除
gulp.task( 'clean', function( done ) {
  var del = require( 'del' );
  del( [ common.dest + '/src' ], done );
} );

// リリース用イメージの生成とコピー
gulp.task( 'release-build', [ 'clean', 'browserify-uglify', 'browserify', 'stylus-with-iconfont' ], function() {
  return gulp.src(
      [
        common.src + '/package.json',
        common.src + '/index.html',
        common.src + '/bundle.js',
        common.src + '/bundle.css',
        common.src + '/fonts/**'
      ],
      { base: common.src }
    )
    .pipe( gulp.dest(  common.dest + '/src' ) );
} );

// nw.js ビルド
gulp.task( 'nw', [ 'release-build' ], function() {
  var builder = new ( require( 'node-webkit-builder' ) )( {
    version:  '0.12.2',
    files:     [ common.dest + '/src/**' ],
    buildDir:  common.dest + '/bin',
    cacheDir:  common.dest + '/nw',
    platforms: [ 'osx64' ]
  } );

  builder.on( 'log', function( message ) {
    $.util.log( 'node-webkit-builder', message );
  } );

  return builder.build().catch( function( err ) {
    $.util.log( 'node-webkit-builder', err );
  } );
} );

// ファイル監視
gulp.task( 'watch', [ 'stylus-with-iconfont', 'browserify-watchfy', 'browserify' ], function () {
  gulp.watch( [ common.src + '/stylus/*.styl' ], [ 'stylus'   ] );
  gulp.watch( [ common.src + '/icons/*.svg' ],   [ 'iconfont' ] );
} );

gulp.task( 'test', function() {
  gulp.src( [ common.test + '/*.js' ] );
} );

// 既定タスク
gulp.task( 'default', [ 'watch' ] );
