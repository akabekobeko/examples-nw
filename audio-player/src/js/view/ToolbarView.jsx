var React     = require( 'react' );
var TextUtil  = require( '../model/util/TextUtility.js' );
var PlayState = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;

/**
 * ツールバー用コンポーネントを描画します。
 *
 * @param {Object} comp コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
module.exports = function( comp ) {
    var music    = comp.currentPlay;
    var title    = ( music ? music.title : '--' );
    var duration = ( comp.duration === 0 ? ( music ? music.duration : 0 ) : comp.duration );
    return (
        <div className="toolbar">
            <div className="wrapper">
                <div className="player">
                    {renderButton( 'prev', comp )}
                    {renderButton( ( comp.playState === PlayState.PLAYING ? 'pause' : 'play' ), comp )}
                    {renderButton( 'next', comp )}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={comp.volume}
                        onChange={comp.onVolumeChange} />
                </div>
                <div className="display">
                    <div className="metadata">
                        <div className="time playtime">{TextUtil.secondsToString( comp.playbackTime )}</div>
                        <div className="title">{title}</div>
                        <div className="time duration">{TextUtil.secondsToString( duration )}</div>
                    </div>
                    <input
                        className="position"
                        type="range"
                        min={0}
                        max={duration}
                        value={comp.playbackTime}
                        onChange={comp.onPositionChange} />
                </div>
                <div className="option">
                    <div className="wrapper">
                        {renderButton( 'add', comp )}
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
 * @param {Object} comp コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
function renderButton( type, comp ) {
    return (
        <div className="button" onClick={comp.onPressButton.bind( comp.self, type )}>
            <i className={'icon-' + type}></i>
        </div>
    );
}
