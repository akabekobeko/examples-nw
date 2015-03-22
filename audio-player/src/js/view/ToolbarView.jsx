var React     = require( 'react' );
var TextUtil  = require( '../model/util/TextUtility.js' );
var PlayState = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;

/**
 * ツールバー用コンポーネントを描画します。
 *
 * @param {ReactClass} component コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
module.exports = function( component ) {
    var player = component.props.player;
    return (
        <div className="toolbar">
            <div className="wrapper">
                <div className="player">
                    {renderButton( 'prev', component )}
                    {renderButton( ( player.playState === PlayState.PLAYING ? 'pause' : 'play' ), component )}
                    {renderButton( 'next', component )}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={player.volume}
                        onChange={component._onVolumeChange} />
                </div>
                <div className="display">
                    <div className="metadata">
                        <div className="time playtime">{TextUtil.secondsToString( player.playbackTime )}</div>
                        <div className="title">{( player.music ? player.music.title : '--' )}</div>
                        <div className="time duration">{TextUtil.secondsToString( player.duration )}</div>
                    </div>
                    <input
                        className="position"
                        type="range"
                        min={0}
                        max={player.duration}
                        value={player.playbackTime}
                        onChange={component._onPositionChange} />
                </div>
                <div className="option">
                    <div className="wrapper">
                        {renderButton( 'add', component )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ボタンを描画します。
 *
 * @param {String} type ボタン種別。
 *
 * @return {Object} React エレメント。
 */
function renderButton( type, component ) {
    return (
        <div className="button" onClick={component._onPressButton.bind( component, type )}>
            <i className={'icon-' + type}></i>
        </div>
    );
}
