var React              = require( 'react' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicListStore     = require( '../model/stores/MusicListStore.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var ToolbarView        = require( '../view/ToolbarView.jsx' );

/**
 * ツールバー用コンポーネントです。
 *
 * @type {ReactClass}
*/
var ToolbarViewModel = React.createClass( {
    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return ToolbarView( {
            self:             this,
            currentPlay:      this.props.currentPlay,
            playState:        this.props.playState,
            duration:         this.props.duration,
            playbackTime:     this.props.playbackTime,
            volume:           this.props.volume,
            onPressButton:    this._onPressButton,
            onVolumeChange:   this._onVolumeChange,
            onPositionChange: this._onPositionChange
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
            if( this.props.playState === PlayState.STOPPED ) {
                AudioPlayerActions.play( this.props.currentPlay );
            } else {
                AudioPlayerActions.play();
            }
            break;

        case 'pause':
            AudioPlayerActions.pause();
            break;

        case 'prev':
            this._moveNext( true );
            break;

        case 'next':
            this._moveNext();
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
    },

    /**
     * 曲選択を変更します。
     *
     * @param  {Boolan} prev 前の曲を選ぶなら true。
     */
    _moveNext: function( prev ) {
        var music = MusicListStore.next( this.props.currentPlay, prev );
        if( !( music ) ) { return; }

        if( this.props.playState === PlayState.STOPPED ) {
            MusicListActions.select( music );
        } else {
            AudioPlayerActions.play( music );
        }
    }
} );

module.exports = ToolbarViewModel;