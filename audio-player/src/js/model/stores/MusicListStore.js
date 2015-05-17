import {EventEmitter}   from 'events';
import AppDispatcher    from '../dispatcher/AppDispatcher.js';
import {ActionTypes}    from '../constants/MusicListConstants.js';
import {OpenFileDialog} from '../util/FileDialog.js';
import MusicList        from '../MusicList.js';

/**
 * イベント種別。
 * @type {String}
 */
const CHANGE_EVENT = 'change';

/**
 * 曲リストを操作します。
 * このクラスはシングルトンとして実装されます。
 *
 * @type {MusicListStore}
 */
class MusicListStore extends EventEmitter {
  /**
   * インスタンスを初期化します。
   */
  constructor() {
    super();

    AppDispatcher.register( this._onAction.bind( this ) );

    /**
     * 唯一の曲リスト操作オブジェクト。
     * @type {MusicList}
     */
    this._musicList = new MusicList();

    /**
     * 唯一の曲リスト。
     * @type {Array.<Music>}
     */
    this._musics = [];

    /**
     * リスト上で選択されている曲。
     * @type {Music}
     */
    this._current = null;

    /**
     * ファイル選択ダイアログ。
     * @type {OpenFileDialog}
     */
    this._openFileDialog = new OpenFileDialog( 'audio/*', true, this._onSelectFiles.bind( this ) );
  }

  /**
   * すべての曲を取得します。
   *
   * @return {Array.<Music>} 曲情報コレクション。
   */
  getAll() {
    return this._musics;
  }

  /**
   * 現在選択されている曲を取得します。
   *
   * @return {Music} 曲情報。何も選択されていない場合は null。
   */
  current() {
    return this._current;
  }

  /**
   * 次の曲を取得します。
   *
   * music が未指定の場合、曲リストで選択されているものの前の曲を取得します。
   * 指定された曲、または選択されている曲がリストの末尾だった場合は null を返します。
   *
   * @param {Music}   music 基準となる曲。
   * @param {Boolean} prev  前の曲を得る場合は true。既定は false。
   *
   * @return {Music} 成功時は曲情報。それ以外は null。
   */
  next( music, prev ) {
    const current = ( music ? music : this._current );
    if( !( current ) ) { return null; }

    let index = -1;
    for( let i = 0, max = this._musics.length; i < max; ++i ) {
      if( this._musics[ i ].id === current.id ) {
        index = ( prev ? i - 1 : i + 1 );
        break;
      }
    }

    return ( 0 <= index && index < this._musics.length ? this._musics[ index ] : null );
  }

  /**
   * イベント リスナーを登録します。
   *
   * @param {Function} callback イベント リスナーとなる関数。
   */
  addChangeListener( callback ) {
    this.on( CHANGE_EVENT, callback );
  }

  /**
   * イベント リスナーの登録を解除します。
   *
   * @param {Function} callback イベント リスナーとなっている関数。
   */
  removeChangeListener( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  }

  /**
   * 更新を通知します。
   */
  _emitChange( err, type, params ) {
    this.emit( CHANGE_EVENT, err, type, params );
  }

  /**
   * アクションが要求された時に発生します。
   *
   * @param {Object} action アクション情報。
   */
  _onAction( action ) {
    switch( action.actionType ) {
    case ActionTypes.INIT:
      this._init();
      break;

    case ActionTypes.SELECT:
      this._select( action.music );
      break;

    case ActionTypes.ADD:
      this._add();
      break;

    case ActionTypes.REMOVE:
      this._remove( action.musicId );
      break;

    default:
      break;
    }
  }

  /**
   * 音楽リストを初期化します。
   *
   * @param {Function} callback コールバック関数。
   */
  _init() {
    this._musicList.init( ( err ) => {
      if( err ) {
        this._emitChange( err, ActionTypes.INIT );
      } else {
        this._musicList.readAll( ( err2, musics ) => {
          if( err2 ) {
            this._emitChange( err2, ActionTypes.INIT );
          } else {
            this._musics = musics;
            if( 0 < this._musics.length ) {
              this._current = this._musics[ 0 ];
            }

            this._emitChange( null, ActionTypes.INIT );
          }
        } );
      }
    } );
  }

  /**
   * 曲を選択します。
   *
   * @param {Music} music 選択対象となる曲。
   *
   * @return {Boolean} 成功時は true。
   */
  _select( music ) {
    if( this._current && music && this._current.id === music.id ) { return false; }

    let err = new Error( 'Failed to select the music, not found.' );
    for( let i = 0, max = this._musics.length; i < max; ++i ) {
      if( music.id === this._musics[ i ].id ) {
        err      = null;
        this._current = music;
        break;
      }
    }

    this._emitChange( err, ActionTypes.SELECT, music );
  }

  /**
   * 音声ファイルを追加します。
   */
  _add() {
    this._openFileDialog.show();
  }

  /**
   * 曲を削除します。
   *
   * @param {Number} musicId  削除対象となる曲の識別子。
   */
  _remove( musicId ) {
    this._musicList.remove( musicId, ( err ) => {
      if( err ) {
        this._emitChange( err, ActionTypes.REMOVE, musicId );
      } else {
        err = new Error( 'Failed to remove the music, not found.' );
        for( let i = 0, max = this._musics.length; i < max; ++i ) {
          if( this._musics[ i ].id === musicId ) {
            err = null;
            this._musics.splice( i, 1 );
            break;
          }
        }

        this._emitChange( err, ActionTypes.REMOVE, musicId );
      }
    } );
  }

  /**
   * 追加対象となるファイルが選択された時に発生します。
   *
   * @param {FileList} files ファイル情報コレクション。
   */
  _onSelectFiles( files ) {
    if( !( files && 0 < files.length ) ) { return; }

    const onAdded = ( err, music ) => {
      if( err ) {
        this._emitChange( err, ActionTypes.ADD );
      } else {
        this._musics.push( music );
        this._emitChange( null, ActionTypes.ADD, music );
      }
    };

    // FileList は Array ではないため forEach を利用できない
    for( let i = 0, max = files.length; i < max; ++i ) {
      this._musicList.add( files[ i ], onAdded.bind( this ) );
    }
  }
}

export default new MusicListStore();
