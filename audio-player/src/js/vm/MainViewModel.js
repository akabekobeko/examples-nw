var React                = require( 'react' );
var AudioPlayerStore     = require( '../model/stores/AudioPlayerStore.js' );
var MusicListActions     = require( '../model/actions/MusicListActions.js' );
var MusicListStore       = require( '../model/stores/MusicListStore.js' );
var MusicListActionTypes = require( '../model/constants/MusicListConstants.js' ).ActionTypes;
var PlayState            = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MainView             = require( '../view/MainView.jsx' );
var ToolbarViewModel     = require( './ToolbarViewModel.js' );
var MusicListViewModel   = require( './MusicListViewModel.js' );
var Util                 = require( '../model/util/Utility.js' );

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
            musics:       [],
            current:      null,
            currentPlay:  null,
            playState:    PlayState.STOPPED,
            duration:     0,
            playbackTime: 0,
            volume:       100
        };
    },

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        AudioPlayerStore.addChangeListener( this._onAudioPlayerChange );
        MusicListStore.addChangeListener( this._onMusicListChange );
        MusicListActions.init();
    },

    /**
     * コンポーネント配置が解除される時に発生します。
     */
    componentWillUnmount: function() {
        AudioPlayerStore.removeChangeListener( this._onAudioPlayerChange );
        MusicListStore.removeChangeListener( this._onMusicListChange );
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return MainView( Util.mixin( this.state, {
            ToolbarViewModel:   ToolbarViewModel,
            MusicListViewModel: MusicListViewModel
        } ) );
    },

    /**
     * 音楽プレーヤーが更新された時に発生します。
     */
    _onAudioPlayerChange: function() {
        this.setState( {
            currentPlay:  AudioPlayerStore.current(),
            playState:    AudioPlayerStore.playState(),
            duration:     AudioPlayerStore.duration(),
            playbackTime: AudioPlayerStore.playbackTime(),
            volume:       AudioPlayerStore.volume()
        } );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange: function() {
        if( this.state.playState === PlayState.STOPPED ) {
            this.setState( {
                musics:      MusicListStore.getAll(),
                current:     MusicListStore.current(),
                currentPlay: MusicListStore.current()
            } );
        } else {
            this.setState( {
                musics:  MusicListStore.getAll(),
                current: MusicListStore.current()
            } );
        }
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
