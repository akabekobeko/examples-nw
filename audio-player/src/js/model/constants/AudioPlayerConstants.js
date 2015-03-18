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
        VOLUME: null,

        /** 前の曲を再生対象とする。 */
        PREV: null,

        /** 次の曲を再生対象とする。 */
        NEXT: null
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
        STOPPED: null,

        /** 再生位置を変更中。 */
        SEEKING: null
    } )
};







 keyMirror( {
    /** 再生。 */
    AUDIOPLAYER_PLAY: null,

    /** 一時停止。 */
    AUDIOPLAYER_PAUSE: null,

    /** 停止。 */
    AUDIOPLAYER_STOP: null,

    /** 再生位置の移動。 */
    AUDIOPLAYER_SEEK: null,

    /** 音量変更。 */
    AUDIOPLAYER_VOLUME: null,

    /** 前の曲を再生対象とする。 */
    AUDIOPLAYER_PREV: null,

    /** 次の曲を再生対象とする。 */
    AUDIOPLAYER_NEXT: null
} );
