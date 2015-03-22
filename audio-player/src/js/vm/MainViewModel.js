var React              = require( 'react' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicStore         = require( '../model/stores/MusicListStore.js' );
var AudioPlayerStore   = require( '../model/stores/AudioPlayerStore.js' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MainView           = require( '../view/MainView.jsx' );
var ToolbarViewModel   = require( './ToolbarViewModel.js' );
var MusicListViewModel = require( './MusicListViewModel.js' );

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
        return {
            musics:      [],
            current:     null,
            player: {
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
        return MainView( this, ToolbarViewModel, MusicListViewModel );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange: function() {
        this.setState( {
            musics:  MusicStore.getAll(),
            current: MusicStore.current(),
            player:  this._currentPlayer()
        } );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onAudioPlayerChange: function() {
        this.setState( { player: this._currentPlayer() } );
    },

    /**
     * 最新の音声プレーヤー情報を取得します。
     *
     * @return {Object} 再生情報。
     */
    _currentPlayer: function() {
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
