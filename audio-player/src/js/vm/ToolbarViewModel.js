var React              = require( 'react' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicListStore     = require( '../model/stores/MusicListStore.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var ToolbarView        = require( '../view/ToolbarView.jsx' );
var Util               = require( '../model/util/Utility.js' );

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
        return ToolbarView( Util.mixin( this.props, {
            self:             this,
            onPressButton:    this._onPressButton,
            onVolumeChange:   this._onVolumeChange,
            onPositionChange: this._onPositionChange
        } ) );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            this._play();
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

        case 'remove':
            this._remove();
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
     * 曲を再生します。
     */
    _play: function() {
        if( this.props.playState === PlayState.STOPPED ) {
            AudioPlayerActions.play( this.props.currentPlay );
        } else {
            AudioPlayerActions.play();
        }
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
    },

    /**
     * 選択している曲を削除します。
     */
    _remove: function() {
        // リスト上の曲を対象とする
        var current = this.props.current;
        if( !( current ) ) { return; }

        var currentPlay = this.props.currentPlay;
        if( currentPlay && currentPlay.id === current.id ) {
            if( this.props.playState === PlayState.STOPPED ) {
                MusicListActions.remove( current.id );
            } else {
                alert( 'Failed to remove the music, is playing.' );
            }

        } else {
            MusicListActions.remove( current.id );
        }
    }
} );

module.exports = ToolbarViewModel;