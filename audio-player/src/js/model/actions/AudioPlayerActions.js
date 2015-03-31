import AppDispatcher from '../dispatcher/AppDispatcher.js';
import {ActionTypes} from '../constants/AudioPlayerConstants.js';

/**
 * 音声プレーヤー操作を定義します。
 * @type {Object}
 */
export default {
    /**
     * 音声を再生します。
     *
     * @param {Music} music 再生対象とする音楽情報。
     */
    play( music ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.PLAY,
            music:      music
        } );
    },

    /**
     * 音声再生を一時停止します。
     */
    pause() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.PAUSE
        } );
    },

    /**
     * 音声再生を停止します。
     */
    stop() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.STOP
        } );
    },

    /**
     * 再生位置を変更します。
     *
     * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
     */
    seek( playbackTime ) {
        AppDispatcher.dispatch( {
            actionType:   ActionTypes.SEEK,
            playbackTime: playbackTime
        } );
    },

    /**
     * 音量を変更します。
     *
     * @param  {Number} volume 新しい音量 ( 0 〜 100 )。
     */
    volume( volume ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.VOLUME,
            volume:     volume
        } );
    },

    /**
     * 再生対象としている曲の選択を解除します。
     */
    unselect() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.UNSELECT
        } );
    }
};
