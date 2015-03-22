var React              = require( 'react' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var AudioPlayerStore   = require( '../model/stores/AudioPlayerStore.js' );
var ToolbarView        = require( '../view/ToolbarView.jsx' );

/**
 * ツールバー用コンポーネントです。
 *
 * @type {ReactClass}
*/
var ToolbarViewModel = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            music:        null,
            playState:    PlayState.STOPPED,
            duration:     0,
            playbackTime: 0,
            volume:       1.0
        };
    },

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        AudioPlayerStore.addChangeListener( this._onAudioPlayerChange );
    },

    /**
     * コンポーネント配置が解除される時に発生します。
     */
    componentWillUnmount: function() {
        AudioPlayerStore.removeChangeListener( this._onAudioPlayerChange );
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return ToolbarView( this );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onAudioPlayerChange: function() {
        this.setState( {
            music:        ( AudioPlayerStore.current() || this.props.music ),
            playState:    AudioPlayerStore.playState(),
            duration:     AudioPlayerStore.duration(),
            playbackTime: AudioPlayerStore.playbackTime(),
            volume:       AudioPlayerStore.volume()
        } );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            if( this.state.playState === PlayState.STOPPED ) {
                AudioPlayerActions.play( this.state.music || this.props.music );
            } else {
                AudioPlayerActions.play();
            }
            break;

        case 'pause':
            AudioPlayerActions.pause();
            break;

        case 'prev':
            break;

        case 'next':
            break;

        case 'add':
            MusicListActions.add();
            break;
        }
    },

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange: function( ev ) {
        AudioPlayerActions.volume( ev.target.value );
    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange: function( ev ) {
        AudioPlayerActions.seek( ev.target.value );
    }
} );

module.exports = ToolbarViewModel;