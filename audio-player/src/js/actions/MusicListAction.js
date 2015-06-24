import { Action } from 'material-flux';

/**
 * 音楽リストの操作種別を定義します。
 * @type {Object}
 */
export const Keys = {
  init:   Symbol( 'MusicListAction.init' ),
  select: Symbol( 'MusicListAction.select' ),
  add:    Symbol( 'MusicListAction.add' ),
  remove: Symbol( 'MusicListAction.remove' ),
  clear:  Symbol( 'MusicListAction.clear' )
};

/**
 * 音楽リストを操作します。
 */
export default class MusicListAction extends Action {

  /**
   * 音楽リストを初期化します。
   */
  init() {
    this.dispatch( Keys.init );
  }

  /**
   * 音楽を追加します。
   *
   * @param {Music} music 音楽情報。
   */
  select( music ) {
    this.dispatch( Keys.select, music );
  }

  /**
   * 音楽を追加します。
   */
  add() {
    this.dispatch( Keys.add );
  }

  /**
   * 音楽を削除します。
   *
   * @param {Number} musicId 削除対象とする音楽の識別子。
   */
  remove( musicId ) {
    this.dispatch( Keys.remove, musicId );
  }

  /**
   * すべての音楽を消去します。
   */
  clear() {
    this.dispatch( Keys.clear );
  }
}
