var React     = require( 'react' );
var Player    = require( './player.jsx' );
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
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        return (
            <div className="content">
                <Player
                    music={this.state.current} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current}
                    onSelect={this._onSelect}
                    onPlay={this._onPlay} />
            </div>
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
