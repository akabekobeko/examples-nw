var React         = require( 'react' );
var ToolbarView   = require( '../view/ToolbarView.jsx' );
var MusicListView = require( '../view/MusicListView.jsx' );
var PlayState     = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var Util          = require('../model/util/Utility.js');

/**
 * アプリケーションのエントリー ポイントになるコンポーネントです。
 *
 * @type {ReactClass}
 */
var MainViewModel = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        var musics = [
            { id: 1, title: 'test1', artist: 'artist1', album: 'album1', duration: 150 },
            { id: 2, title: 'test2', artist: 'artist2', album: 'album2', duration: 120 }
        ];

        return {
            // 音楽リスト
            musics:        musics,
            current:       musics[ 0 ],
            onSelectMusic: this._onSelectMusic,
            onSelectPlay:  this._onSelectPlay,

            // ツールバー
            currentPlay:      musics[ 0 ],
            playState:        PlayState.STOPPED,
            duration:         musics[ 0 ].duration,
            playbackTime:     0,
            volume:           100,
            onPressButton:    this._onPressButton,
            onVolumeChange:   this._onVolumeChange,
            onPositionChange: this._onPositionChange
        };
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var comp = Util.mixin( this.state, { self: this } );
        return (
            <article className="app">
                {ToolbarView( comp )}
                {MusicListView( comp )}
            </article>
        );
    },

        /**
     * 音楽が選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectMusic: function( music ) {
        console.log( '_onSelectMusic' );
        this.setState( { current: music, currentPlay: music, duration: music.duration } );
    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectPlay: function( music ) {
        console.log( '_onSelectPlay' );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        console.log( '_onPressButton: type = ' + type );
    },

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange: function( ev ) {
        console.log( '_onVolumeChange: value = ' + ev.target.value );
        this.setState( { volume: ev.target.value } );
    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange: function( ev ) {
        console.log( '_onPositionChange: value = ' + ev.target.value );
        this.setState( { playbackTime: ev.target.value } );
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
        <MainViewModel />,
        document.querySelector( query )
    );
};
