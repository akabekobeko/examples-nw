import { Store }          from 'material-flux';
import { Keys }           from '../actions/MusicListAction.js';
import { OpenFileDialog } from '../model/FileDialog.js';
import MusicList          from '../model/MusicList.js';

/**
 * 曲リストを操作します。
 * このクラスはシングルトンとして実装されます。
 *
 * @type {MusicListStore}
 */
export default class MusicListStore extends Store {
  /**
   * インスタンスを初期化します。
   *
   * @param {Context} context コンテキスト。
   */
  constructor( context ) {
    super( context );

    this.register( Keys.init,   this._actionInit   );
    this.register( Keys.select, this._actionSelect );
    this.register( Keys.add,    this._actionAdd    );
    this.register( Keys.remove, this._actionRemove );

    /**
     * 変更監視される値。
     * @type {Object}
     */
    this.state = {
      /**
       * 唯一の曲リスト。
       * @type {Array.<Music>}
       */
      musics: [],

      /**
       * リスト上で選択されている曲。
       * @type {Music}
       */
      current: null
    };

    /**
     * 唯一の曲リスト操作オブジェクト。
     * @type {MusicList}
     */
    this._musicList = new MusicList();

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
  get musics() {
    return this.state.musics;
  }

  /**
   * 現在選択されている曲を取得します。
   *
   * @return {Music} 曲情報。何も選択されていない場合は null。
   */
  get current() {
    return this.state.current;
  }

  /**
   * 次の曲を取得します。
   *
   * music が未指定の場合、曲リストで選択されているものの前の曲を取得します。
   * 指定された曲、または選択されている曲がリストの末尾だった場合は null を返します。
   *
   * @param {Music}   target 基準となる曲。
   * @param {Boolean} prev   前の曲を得る場合は true。既定は false。
   *
   * @return {Music} 成功時は曲情報。それ以外は null。
   */
  next( target, prev ) {
    const current = ( target ? target : this.state.current );
    if( !( current ) ) { return null; }

    let next = null;
    this.state.musics.some( ( music, index ) => {
      if( music.id === current.id ) {
        const position =  ( prev ? index - 1 : index + 1 );
        next = this.state.musics[ position ];
        return true;
      }

      return false;
    } );

    return next;
  }

  /**
   * 音楽リストを初期化します。
   */
  _actionInit() {
    this._musicList.init( ( err ) => {
      if( err ) {
        console.error( err );
      } else {
        this._musicList.readAll( ( err2, musics ) => {
          if( err2 ) {
            console.error( err2 );
          } else {
            const state = { musics: musics };
            if( 0 < musics.length ) {
              state.current = musics[ 0 ];
            }

            this.setState( state );
          }
        } );
      }
    } );
  }

  /**
   * 曲を選択します。
   *
   * @param {Music} target 選択対象となる曲。
   */
  _actionSelect( target ) {
    if( this.state.current && target && this.state.current.id === target.id ) { return false; }

    //let err = new Error( 'Failed to select the music, not found.' );
    let newMusic = null;
    this.state.musics.some( ( music ) => {
      if( target.id === music.id ) {
        newMusic = music;
        return true;
      }

      return false;
    } );

    if( newMusic ) {
      this.setState( { current: newMusic } );
    } else {
      console.error( 'Failed to select the music, not found.' );
    }
  }

  /**
   * 音声ファイルを追加します。
   */
  _actionAdd() {
    this._openFileDialog.show();
  }

  /**
   * 曲を削除します。
   *
   * @param {Number} musicId  削除対象となる曲の識別子。
   */
  _actionRemove( musicId ) {
    this._musicList.remove( musicId, ( err ) => {
      if( err ) {
        console.error( err );
      } else {
        const newMusics = this.state.musics.filter( ( music ) => {
          return ( music.id !== musicId );
        } );

        if( newMusics.length !== this.state.musics.length ) {
          this.setState( { musics: newMusics } );
        } else {
          console.error( 'Failed to remove the music, not found.' );
        }
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
        console.error( err );
      } else {
        const newMusics = this.state.musics.concat( music );
        this.setState( { musics: newMusics } );
      }
    };

    // FileList は Array ではないため forEach を利用できない
    for( let i = 0, max = files.length; i < max; ++i ) {
      this._musicList.add( files[ i ], onAdded );
    }
  }
}
