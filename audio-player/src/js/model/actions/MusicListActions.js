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
  init() {
    AppDispatcher.dispatch( {
      actionType: ActionTypes.INIT
    } );
  },

  /**
   * 音楽を追加します。
   *
   * @param {Music} music 音楽情報。
   */
  select( music ) {
    AppDispatcher.dispatch( {
      actionType: ActionTypes.SELECT,
      music:      music
    } );
  },

  /**
   * 音楽を追加します。
   */
  add() {
    AppDispatcher.dispatch( {
      actionType: ActionTypes.ADD
    } );
  },

  /**
   * 音楽を削除します。
   *
   * @param {Number} musicId 削除対象とする音楽の識別子。
   */
  remove( musicId ) {
    AppDispatcher.dispatch( {
      actionType: ActionTypes.REMOVE,
      musicId:    musicId
    } );
  },

  /**
   * すべての音楽を消去します。
   */
  clear() {
    AppDispatcher.dispatch( {
      actionType: ActionTypes.CLEAR
    } );
  }
};
