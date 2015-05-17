/**
 * IndexedDB を操作しやすくするためのユーティリティです。
 */
 export default class IndexedDBWrapper {
  /**
   * インスタンスを初期化します。
   *
   * @param {String} dbName      データベース名。
   * @param {Number} dbVersion   データベースのバージョン番号。
   * @param {String} dbStoreName ストア名。
   */
  constructor( dbName, dbVersion, dbStoreName ) {
    // IndexedDB チェック
    this._indexedDB = ( window.indexedDB || window.mozIndexedDB || window.msIndexedDB || window.webkitIndexedDB );
    if( !( this._indexedDB ) ) {
      throw new Error( 'IndexedDB not supported.' );
    }

    /**
     * データベース。
     * @type {Object}
     */
    this._db = null;

    /**
     * データベース名。
     * @type {String}
     */
    this._dbName = dbName;

    /**
     * データベースのバージョン番号。
     * @type {Number}
     */
    this._dbVersion = dbVersion;

    /**
     * ストア名。
     * @type {[String]}
     */
    this._dbStoreName = dbStoreName;
  }

  /**
   * 各関数でコールバックが未指定だった時、代りに実行される関数です。
   *
   * @param  {Error} err エラー情報。
   *
   * @return 常に false。カーソル系で継続可否を問い合わせるコールバックの場合、中断となる。
   */
  _defaultCallback( err ) {
    if( err ) {
      console.log( 'DB [callback]: Error, ' + err.message );
    } else {
      console.log( 'DB [callback]: Success' );
    }

    return false;
  }

  /**
   * データベースを開きます。
   *
   * @param {Object}   params   パラメータ。create = createObjectStore オプション( 必須 )。
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   *
   * @throws {Error} params.create が未指定です。
   */
  open( params, callback ) {
    if( !( params && params.create ) ) { throw new Error( 'Invalid arguments' ); }

    const onFinish = ( callback || this._defaultCallback );
    const request  = this._indexedDB.open( this._dbName, this._dbVersion );

    request.onupgradeneeded = ( ev ) => {
      // ストア生成
      this._db = ev.target.result;
      const store = this._db.createObjectStore( this._dbStoreName, params.create );

      // インデックス
      if( params.index && 0 < params.index.length ) {
        params.index.forEach( function( index ) {
          store.createIndex( index.name, index.keyPath, index.params );
        } );
      }

      ev.target.transaction.oncomplete = () => {
        onFinish();
      };
    };

    request.onsuccess = ( ev ) => {
      this._db = ev.target.result;
      onFinish();
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error );
    };
  }

  /**
   * データベースを破棄します。
   *
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   */
  dispose( callback ) {
    const onFinish = ( callback || this._defaultCallback );

    if( this._db ) {
      this._db.close();
      this._db = null;
    }

    const request = this._indexedDB.deleteDatabase( this._dbName );
    request.onsuccess = () => {
      onFinish();
    };

    request.onerror = ( ev ) => {
      console.log( 'DB [ dispose ]: Error, ' + ev.target.error );
      onFinish( ev.target.error );
    };
  }

  /**
   * データを全て消去します。
   *
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   */
  clear( callback ) {
    if( !( this._db ) ) { return; }

    const onFinish    = ( callback || this._defaultCallback );
    const transaction = this._db.transaction( this._dbStoreName, 'readwrite' );
    const store       = transaction.objectStore( this._dbStoreName );
    const request     = store.clear();

    request.onsuccess = () => {
      onFinish();
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error );
    };
  }

  /**
   * 全アイテムを読み取ります。
   *
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   */
  readAll( callback ) {
    if( !( this._db ) ) { return; }

    const onFinish    = ( callback || this._defaultCallback );
    const transaction = this._db.transaction( this._dbStoreName, 'readonly' );
    const store       = transaction.objectStore( this._dbStoreName );
    const request     = store.openCursor();
    const items       = [];

    request.onsuccess = ( ev ) => {
      const cursor = ev.target.result;
      if( cursor ) {
        items.push( cursor.value );
        cursor.continue();

      } else {
        onFinish( null, items );
      }
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error );
    };
  }

  /**
   * 全アイテムを中断されるまで読み取ります。
   *
   * @param {Function} callback アイテムが 1 件、読み込まれるごとに呼び出される関数。true を返すと次の値を読み取ります。
   */
  readSome( callback ) {
    if( !( this._db ) ) { return; }

    const onFinish    = ( callback || this._defaultCallback );
    const transaction = this._db.transaction( this._dbStoreName, 'readonly' );
    const store       = transaction.objectStore( this._dbStoreName );
    const request     = store.openCursor();

    request.onsuccess = ( ev ) => {
      const cursor = ev.target.result;
      if( cursor ) {
        if( onFinish( null, cursor.value ) ) {
          cursor.continue();
        }
      } else {
        onFinish( null, cursor.value );
      }
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error );
    };
  }

  /**
   * アイテムを追加または更新します。
   *
   * @param {Object}   item     アイテム。id プロパティが有効値 ( 1 以上の整数 ) なら既存アイテムを更新します。
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   */
  add( item, callback ) {
    if( !( this._db ) ) { return; }

    const onFinish    = ( callback || this._defaultCallback );
    const transaction = this._db.transaction( this._dbStoreName, 'readwrite' );
    const store       = transaction.objectStore( this._dbStoreName );
    const request     = store.put( item );

    request.onsuccess = ( ev ) => {
      item.id = ev.target.result;
      onFinish( null, item );
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error, item );
    };
  }

  /**
   * アイテムを削除します。
   *
   * @param {Number}   id       音楽情報の識別子。
   * @param {Function} callback 処理が終了した時に呼び出される関数。
   */
  remove( id, callback ) {
    if( !( this._db ) ) { return; }

    const onFinish    = ( callback || this._defaultCallback );
    const transaction = this._db.transaction( this._dbStoreName, 'readwrite' );
    const store       = transaction.objectStore( this._dbStoreName );
    const request     = store.delete( id );

    request.onsuccess = () => {
      onFinish( null, id );
    };

    request.onerror = ( ev ) => {
      onFinish( ev.target.error, id );
    };
  }
}
