var React              = require( 'react' );
var Toolbar            = require( './Toolbar.jsx' );
var MusicList          = require( './MusicList.jsx' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicStore         = require( '../model/stores/MusicListStore.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var AudioPlayerStore   = require( '../model/stores/AudioPlayerStore.js' );

/**
 * アプリケーションのエントリー ポイントになるコンポーネントです。
 *
 * @type {Object}
 */
var AudioPlayerApp = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            musics:      [],
            current:     null,
            currentPlay: null
        };
    },

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        AudioPlayerStore.addChangeListener( this._onAudioPlayerChange );
        MusicStore.addChangeListener( this._onMusicListChange );

        MusicListActions.init();
    },

    /**
     * コンポーネント配置が解除される時に発生します。
     */
    componentWillUnmount: function() {
        AudioPlayerStore.removeChangeListener( this._onAudioPlayerChange );
        MusicStore.removeChangeListener( this._onMusicListChange );
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return (
            <article className="app">
                <Toolbar music={this.state.current} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current}
                    onSelectMusic={this._onSelectMusic}
                    onSelectPlay={this._onSelectPlay} />
            </article>
        );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange: function() {
        this.setState( { musics: MusicStore.getAll(), current: MusicStore.current() } );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onAudioPlayerChange: function() {
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
        <AudioPlayerApp />,
        document.querySelector( query )
    );
};
