import AppDispatcher from '../dispatcher/AppDispatcher.js';
import {ActionTypes} from '../constants/MusicListConstants.js';

/**
 * 音声プレーヤー操作を定義します。
 * @type {Object}
 */
export default {
    /**
     * 音楽リストを初期化します。
     */
    init: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.INIT
        } );
    },

    /**
     * 音楽を追加します。
     *
     * @param {Music} music 音楽情報。
     */
    select: function( music ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.SELECT,
            music:      music
        } );
    },

    /**
     * 音楽を追加します。
     */
    add: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.ADD
        } );
    },

    /**
     * 音楽を削除します。
     *
     * @param {Number} musicId 削除対象とする音楽の識別子。
     */
    remove: function( musicId ) {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.REMOVE,
            musicId:    musicId
        } );
    },

    /**
     * すべての音楽を消去します。
     */
    clear: function() {
        AppDispatcher.dispatch( {
            actionType: ActionTypes.CLEAR
        } );
    }
};
