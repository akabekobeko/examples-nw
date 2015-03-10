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
            musics: this._dummyMusics(),
            current: null,
            db: null
        };
    },

    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        return (
            <article className="app">
                <Toolbar
                    music={this.state.current} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current}
                    onSelect={this._onSelect}
                    onPlay={this._onPlay} />
            </article>
        );
    },

    /**
     * 音楽が選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelect: function( music ) {

    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onPlay: function( music ) {

    },

    _dummyMusics: function() {
        return [
            { id: 1, title: 'test1', artist: 'artist1', album: 'album1', duration: '4:52' },
            { id: 2, title: 'test2', artist: 'artist2', album: 'album2', duration: '3:09' },
            { id: 3, title: 'test3', artist: 'artist3', album: 'album3', duration: '5:18' },
            { id: 4, title: 'test4', artist: 'artist4', album: 'album4', duration: '4:52' },
            { id: 5, title: 'test5', artist: 'artist5', album: 'album5', duration: '4:52' },
            { id: 6, title: 'test6', artist: 'artist6', album: 'album6', duration: '4:52' },
            { id: 7, title: 'test7', artist: 'artist7', album: 'album7', duration: '6:47' },
            { id: 8, title: 'test8', artist: 'artist8', album: 'album8', duration: '4:52' },
        ];
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
