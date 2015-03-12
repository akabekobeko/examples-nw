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
        var audioPlayer = null;
        try {
           audioPlayer = new ( require( '../model/audio-player.js' ) )();
        } catch( exp ) {
            alert( exp.message );
        }

        return {
            audioPlayer: audioPlayer,
            musics: [],
            current: null,
            db: null
        };
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
                    onAddFiles={this.onAddFiles} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current}
                    onSelectMusic={this.onSelectMusic}
                    onSelectPlay={this.onSelectPlay} />
            </article>
        );
    },

    /**
     * すべての音楽情報を読み込みます。
     */
    load: function() {
        try {
            var MusicStore = require( '../model/music-store.js' );
            this.state.db = new MusicStore();

        } catch( exp ) {
            this.state.db = null;
            alert( exp.message );
            return;
        }

        this.state.db.init( function( err ) {
            if( err ) {
                alert( err.message );
                return;
            }

            this.state.db.readAll( function( err, musics ) {
                if( err ) {
                    alert( err.message );
                    return;
                }

                this.setState( { musics: musics } );

            }.bind( this ) );


        }.bind( this ) );
    },

    /**
     * コンテンツ追加が要求された時に発生します。
     *
     * @param {FileList} files ファイル情報コレクション。input[type="file"] で読み取られた情報を指定してください。
     */
    onAddFiles: function( files ) {
        if( !( files && 0 < files.length && this.state.db ) ) { return; }
        console.dir( files );

        var onAdded = function( err, newMusic ) {
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
    onSelectMusic: function( music ) {

    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    onSelectPlay: function( music ) {

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
