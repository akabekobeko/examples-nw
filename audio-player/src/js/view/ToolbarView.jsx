import React       from 'react';
import Util        from '../model/util/Utility.js';
import {PlayState} from '../model/constants/AudioPlayerConstants.js';

/**
 * ツールバー用コンポーネントを描画します。
 *
 * @param {Object} comp コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
export default ( comp ) => {
    let music     = comp.currentPlay;
    let title     = ( music ? music.title : '--' );
    let duration  = ( comp.duration === 0 ? ( music ? music.duration : 0 ) : comp.duration );
    let playpause = ( comp.playState === PlayState.PLAYING ? 'pause' : 'play' );

    return (
        <div className="toolbar">
            <div className="wrapper">
                <div className="player">
                    {renderButton( comp, 'prev' )}
                    {renderButton( comp, playpause )}
                    {renderButton( comp, 'next' )}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={comp.volume}
                        onChange={comp.onVolumeChange.bind( comp.self )} />
                </div>
                <div className="display">
                    <div className="metadata">
                        <div className="time playtime">{Util.secondsToString( comp.playbackTime )}</div>
                        <div className="title">{title}</div>
                        <div className="time duration">{Util.secondsToString( duration )}</div>
                    </div>
                    <input
                        className="position"
                        type="range"
                        min={0}
                        max={duration}
                        value={comp.playbackTime}
                        onChange={comp.onPositionChange.bind( comp.self )} />
                </div>
                <div className="option">
                    <div className="wrapper">
                        {renderButton( comp, 'remove' )}
                        {renderButton( comp, 'add' )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ボタンを描画します。
 *
 * @param {Object} comp コンポーネント。
 * @param {String} type ボタン種別。
 *
 * @return {ReactElement}  React エレメント。
 */
function renderButton( comp, type ) {
    return (
        <div className="button" onClick={comp.onPressButton.bind( comp.self, type )}>
            <i className={'icon-' + type}></i>
        </div>
    );
}
