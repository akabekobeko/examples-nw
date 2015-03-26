var keyMirror = require( 'react/lib/keyMirror' );

/**
 * 音声プレーヤー用の定数を定義します。
 * @type {Object}
 */
module.exports = {
    /**
     * アクション種別を定義します。
     * @type {Object}
     */
    ActionTypes:  keyMirror( {
        /** 再生。 */
        PLAY: null,

        /** 一時停止。 */
        PAUSE: null,

        /** 停止。 */
        STOP: null,

        /** 再生位置の移動。 */
        SEEK: null,

        /** 音量変更。 */
        VOLUME: null
    } ),

    /**
     * 再生状態を定義します。
     * @type {Object}
     */
    PlayState: keyMirror( {
        /** 再生中。 */
        PLAYING: null,

        /** 一時停止。 */
        PAUSED: null,

        /** 停止。 */
        STOPPED: null
    } )
};
