var React     = require( 'react' );
var Toolbar   = require( './toolbar.jsx' );
var MusicList = require( './music-list.jsx' );

/**
 * アプリケーションのエントリー ポイントになるコンポーネントです。
 *
 * @type {Object}
 */
var Main = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            musics: [],
            current: null,
            db: null
        };
    },

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        var db = null;
        try {
            var MusicStore = require( '../model/music-store.js' );
            db = new MusicStore();

        } catch( exp ) {
            alert( exp.message );
            return;
        }

        db.init( function( err ) {
            if( err ) {
                alert( err.message );
                return;
            }

            db.readAll( function( err, musics ) {
                if( err ) {
                    alert( err.message );
                    return;
                }

                this.setState( { db: db, musics: musics } );

            }.bind( this ) );

        }.bind( this ) );
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return (
            <article className="app">
                <Toolbar
                    music={this.state.current}
                    onAddFiles={this._onAddFiles} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current}
                    onSelectMusic={this._onSelectMusic}
                    onSelectPlay={this._onSelectPlay} />
            </article>
        );
    },

    /**
     * コンテンツ追加が要求された時に発生します。
     *
     * @param {FileList} files ファイル情報コレクション。input[type="file"] で読み取られた情報を指定してください。
     */
    _onAddFiles: function( files ) {
        if( !( files && 0 < files.length && this.state.db ) ) { return; }

        var onAdded = function( err, newMusic ) {
            if( err ) {
                console.log( err.message );
                return;
            }

            var musics = this.state.musics.concat( [ newMusic ] );
            this.setState( { musics: musics } );

        }.bind( this );

        // FileList は forEach が未定義なので、ベタに繰り返す
        for( var i = 0, max = files.length; i < max; ++i ) {
            this.state.db.add( files[ i ], onAdded );
        }
    },

    /**
     * 音楽が選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectMusic: function( music ) {
        this.setState( { current: music } );
    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectPlay: function( music ) {

    }
} );

/**
 * コンポーネント処理を開始します。
 *
 * @param {Object} query コンポーネントの配置対象となる DOM を示すクエリ。
 *
 * @return {Object} コンポーネント。
 */
module.exports = function( query ) {
    return React.render(
        <Main />,
        document.querySelector( query )
    );
};
