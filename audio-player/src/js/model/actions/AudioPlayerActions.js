
var AppDispatcher        = require( '../dispatcher/AppDispatcher.js' );
var AudioPlayerConstants = require( '../constants/AudioPlayerConstants.js' );
var ActionTypes          = AudioPlayerConstants.ActionTypes;

/**
 * 音声プレーヤー操作を定義します。
 * @type {Object}
 */
var AudioPlayerActions = {
    /**
     * 音声を再生します。
     *
     * @param {Music} music 再生対象とする音楽情報。
     */
    play: function( music ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.PLAY,
            music:      music
        } );
    },

    /**
     * 音声再生を一時停止します。
     */
    pause: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.PAUSE
        } );
    },

    /**
     * 音声再生を停止します。
     */
    stop: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.STOP
        } );
    },

    /**
     * 再生位置を変更します。
     *
     * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
     */
    seek: function( playbackTime ) {
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
    volume: function( volume ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.VOLUME,
            volume:     volume
        } );
    },

    /**
     * 前の曲を再生対象として要求します。
     */
    prev: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.PREV
        } );
    },

    /**
     * 次の曲を再生対象として要求します。
     */
    next: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.NEXT
        } );
    }
};

module.exports = AudioPlayerActions;
