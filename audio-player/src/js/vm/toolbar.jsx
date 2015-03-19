var React              = require( 'react' );
var TextUtil           = require( '../model/util/TextUtility.js' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var AudioPlayerStore   = require( '../model/stores/AudioPlayerStore.js' );

/**
 * ツールバー用コンポーネントです。
 */
var Toolbar = React.createClass( {
    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var player       = this.props.currentPlay;
        var playIcon     = ( player.playState === PlayState.PLAYING ? 'pause' : 'play' );
        var playbackTime = TextUtil.secondsToString( player.playbackTime );
        var duration     = TextUtil.secondsToString( player.duration );
        var music        = this.props.currentPlay.music;
        
        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        {this._renderButton( 'prev' )}
                        {this._renderButton( playIcon )}
                        {this._renderButton( 'next' )}
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={player.volume}
                            onChange={this._onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="time playtime">{playbackTime}</div>
                            <div className="title">{music ? music.title : '--'}</div>
                            <div className="time duration">{duration}</div>
                        </div>
                        <input
                            className="position"
                            type="range"
                            min={0}
                            max={player.duration}
                            value={player.playbackTime}
                            onChange={this._onPositionChange} />
                    </div>
                    <div className="option">
                        <div className="wrapper">
                            {this._renderButton( 'add' )}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * ボタンを描画します。
     *
     * @param {String} type ボタン種別。
     *
     * @return {Object} React エレメント。
     */
    _renderButton: function( type ) {
        return (
            <div className="button" onClick={this._onPressButton.bind( this, type )}>
                <i className={'icon-' + type}></i>
            </div>
        );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            if( AudioPlayerStore.isOpened() === PlayState.STOPPED ) {
                AudioPlayerActions.play( this.props.currentPlay.music );
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

module.exports = Toolbar;