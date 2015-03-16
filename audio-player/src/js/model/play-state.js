/**
 * 再生状態を示す値を定義します。
 * @type {Object}
 */
module.exports = {
    /**
     * 停止されていることを示す値。
     * @type {Number}
     */
    STOPPED: 0,

    /**
     * 再生中であることを示す値。
     * @type {Number}
     */
    PLAYING: 1,

    /**
     * 一時停止されていることを示す値。
     * @type {Number}
     */
    PAUSED: 2,

    /**
     * 再生位置が変更中であることを示す値。
     * @type {Number}
     */
    SEEKING: 3
};
