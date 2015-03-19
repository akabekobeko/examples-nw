var React              = require( 'react' );
var Toolbar            = require( './Toolbar.jsx' );
var MusicList          = require( './MusicList.jsx' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicStore         = require( '../model/stores/MusicListStore.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var AudioPlayerStore   = require( '../model/stores/AudioPlayerStore.js' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;

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
            currentPlay: {
                music:        null,
                playState:    PlayState.STOPPED,
                duration:     0,
                playbackTime: 0,
                volume:       1.0
            }
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
                <Toolbar currentPlay={this.state.currentPlay} />
                <MusicList
                    musics={this.state.musics}
                    current={this.state.current} />
            </article>
        );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange: function() {
        this.setState( {
            musics:      MusicStore.getAll(),
            current:     MusicStore.current(),
            currentPlay: this._currentPlay()
        } );
    },

    /**
     * 最新の再生情報を取得します。
     *
     * @return {Object} 再生情報。
     */
    _currentPlay: function() {
        if( AudioPlayerStore.playState() === PlayState.STOPPED ) {
            var music = ( AudioPlayerStore.current() || MusicStore.current() );
            return {
                music:        ( AudioPlayerStore.current() || MusicStore.current() ),
                playState:    PlayState.STOPPED,
                duration:     ( music ? music.duration : 0 ),
                playbackTime: 0,
                volume:       AudioPlayerStore.volume()
            };

        } else {
            return {
                music:        ( AudioPlayerStore.current() || MusicStore.current() ),
                playState:    AudioPlayerStore.playState(),
                duration:     AudioPlayerStore.duration(),
                playbackTime: AudioPlayerStore.playbackTime(),
                volume:       AudioPlayerStore.volume()
            };
        }
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onAudioPlayerChange: function() {
        this.setState( { currentPlay: this._currentPlay() } );
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
