var React              = require( 'react' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
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
        return ToolbarView( this );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            if( this.props.player.playState === PlayState.STOPPED ) {
                AudioPlayerActions.play( this.props.player.music );
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