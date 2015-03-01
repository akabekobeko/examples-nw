/**
 * 汎用タスクから参照される設定です。
 *
 * @type {Object}
 */
module.exports = {
    /**
     * タスク 'css' 用の設定です。Stylus ファイルを CSS にコンパイルします。
     * 以下の npm に依存しています。
     *
     * gulp gulp-load-plugins gulp-stylus gulp-plumber gulp-sourcemaps
     *
     * @type {Object}
     */
    css: {
        src:    './src/stylus/*.styl',
        dest:   './src/css',
        stylus: {
            compress: true
        }
    },

    /**
     * タスク 'icon' 用の設定です。SVG ファイルからアイコン フォントを生成します。
     * 以下の npm に依存しています。
     *
     * gulp gulp-load-plugins gulp-iconfont gulp-consolidate gulp-rename
     * lodash
     *
     * @type {Object}
     */
    iconfont: {
        src:      './src/icons/*.svg',
        dest:     './src/fonts',
        name:     'icon',
        template: {
            css:  {
                src:  './src/icons/template.css',
                dest: './src/css',
                name: 'icon',
                ref:  '../fonts/'
            },
            html: {
                src:  './src/icons/template.html',
                dest: './src',
                name: 'icon-sample'
            }
        }
    },

    /**
     * タスク 'js'、'js-release'、'watchify' 用の設定です。
     * 'js'、'js-release' は JavaScript をコンパイルして単一のファイルを生成します。
     * 'watchify' は依存関係のあるファイルの変更を監視して差分コンパイルを実行します。
     *
     * 以下の npm に依存しています。
     * Browserify の transform を利用する場合は、そのための npm も必要です。
     *
     * gulp gulp-load-plugins gulp-sourcemaps gulp-uglify gulp-if
     * browserify watchify vinyl-source-stream vinyl-buffer pretty-hrtime
     *
     * @type {Object}
     */
    js: {
        src:        './src/js/app.js',
        dest:       './src/js',
        bundle:     'bundle.js',
        browserify: {
            debug:     true,
            transform: [ 'reactify' ]
        }
    },

    /**
     * タスク 'nw' の設定です。nw.js アプリをビルドします。
     * 以下の npm に依存しています。
     *
     * gulp gulp-load-plugins gulp-util
     * node-webkit-builder
     *
     * @type {Object}
     */
    nw: {
        builder: {
            version:  '0.11.5',
            files:     [ './bin/src/**' ],
            buildDir:  './bin/release',
            cacheDir:  './bin/nw',
            platforms: [ 'osx64' ]
        
        }
    },

    /**
     * タスク 'useref' の設定です。HTML 内の CSS、JavaScript 参照を調べ、適切なファイルにまとめます。
     * 以下の npm に依存しています。
     *
     * gulp gulp-load-plugins gulp-useref gulp-minify-css gulp-if
     * node-webkit-builder
     *
     * @type {Object}
     */
    useref: {
        src:  './src/index.html',
        dest: './bin/src'
    }
};