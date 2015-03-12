/**
 * データベース ( IndexedDB ) ストアを提供します。
 *
 * @param {String} dbName      データベース名。
 * @param {Number} dbVersion   データベースのバージョン番号。
 * @param {String} dbStoreName ストア名。
 */
var DBStore = function( dbName, dbVersion, dbStoreName ) {
    // IndexedDB チェック
    var _indexedDB = ( window.indexedDB || window.mozIndexedDB || window.msIndexedDB || window.webkitIndexedDB );
    if( !( _indexedDB ) ) {
        throw new Error( 'IndexedDB not supported.' );
    }

    /**
     * データベース。
     * @type {Object}
     */
    var _db = null;

    /**
     * データベースを開きます。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.open = function( callback ) {
        var request = _indexedDB.open( dbName, dbVersion );

        request.onupgradeneeded = function( ev ) {
            console.log( 'DB [ oepn ]: Success, Upgrade' );

            _db = ev.target.result;
            var store = _db.createObjectStore( dbStoreName, { keyPath: 'id', autoIncrement: true } );
            ev.target.transaction.oncomplete = function() {
                if( callback ) { callback( store ); }
            };
        };

        request.onsuccess = function( ev ) {
            console.log( 'DB [ oepn ]: Success' );

            _db = ev.target.result;
            if( callback ) { callback(); }
        };
         
        request.onerror = function( ev ) {
            console.log( 'DB [ oepn ]: Error, ' + ev );

            if( callback ) { callback( ev ); }
        };
    };

    /**
     * データベースを破棄します。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.dispose = function( callback ) {
        if( !( _db ) ) { return; }

        _db.close();

        var request = _indexedDB.deleteDatabase( dbName );
        request.onsuccess = function( ev ) {
            console.log( 'DB [ dispose ]: Success' );

            _db = null;
            if( callback ) { callback(); }
        };
         
        request.onerror = function( ev ) {
            console.log( 'DB [ dispose ]: Error, ' + ev );

            if( callback ) { callback( ev ); }
        };
    };

    /**
     * データを全て消去します。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.clear = function( callback ) {
        if( !( _db ) ) { return; }

        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.clear();

        request.onsuccess = function( ev ) {
            if( callback ) { callback( null ); }
        };
     
        request.onerror = function( ev ) {
            console.log( ev );
            if( callback ) { callback( ev ); }
        };
    };

    /**
     * 全アイテムを読み取ります。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.readAll = function( callback ) {
        if( !( _db ) ) { return; }

        var transaction = _db.transaction( dbStoreName, 'readonly' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.openCursor();
        var items       = [];

        request.onsuccess = function( ev ) {
            var cursor = ev.target.result;
            if( cursor ) {
                items.push( cursor.value );
                cursor.continue();

            } else {
                callback( null, items );
            }
        };

        request.onerror = function( ev ) {
            if( callback ) { callback( ev ); }
        };
    };

    /**
     * 全アイテムを中断されるまで読み取ります。
     *
     * @param {Function} callback アイテムが 1 件、読み込まれるごとに呼び出される関数。true を返すと次の値を読み取ります。
     */
    this.readSome = function( callback ) {
        if( !( _db ) ) { return; }

        var transaction = _db.transaction( dbStoreName, 'readonly' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.openCursor();

        request.onsuccess = function( ev ) {
            var cursor = ev.target.result;
            if( cursor ) {
                if( callback( null, cursor.value ) ) {
                    cursor.continue();
                }
            } else {
                callback( null, cursor.value );
            }
        };

        request.onerror = function( ev ) {
            if( callback ) { callback( ev ); }
        };
    };

    /**
     * アイテムを追加または更新します。
     *
     * @param {Object}   item     アイテム。id プロパティが有効値 ( 1 以上の整数 ) なら既存アイテムを更新します。
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.addItem = function( item, callback ) {
        if( !( _db ) ) { return; }

        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.put( item );

        request.onsuccess = function( ev ) {
            item.id = ev.target.result;
            if( callback ) { callback( null, item ); }
        };
     
        request.onerror = function( ev ) {
            console.log( ev );
            if( callback ) { callback( ev, item ); }
        };
    };

    /**
     * アイテムを削除します。
     *
     * @param {Number}   id       音楽情報の識別子。
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.deleteItem = function( id, callback ) {
        if( !( _db ) ) { return; }

        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.delete( id );

        request.onsuccess = function( ev ) {
            if( callback ) { callback( null, id ); }
        };
     
        request.onerror = function( ev ) {
            if( callback ) { callback( ev, id ); }
        };
    };
};

module.exports = DBStore;