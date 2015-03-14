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
     * 各関数でコールバックが未指定だった時、代りに実行される関数です。
     *
     * @param  {Error} err エラー情報。
     *
     * @return 常に false。カーソル系で継続可否を問い合わせるコールバックの場合、中断となる。
     */
    function defaultCallback( err ) {
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
    this.open = function( params, callback ) {
        if( !( params && params.create ) ) { throw new Error( 'Invalid arguments' ); }

        var onFinish = ( callback || defaultCallback );
        var request  = _indexedDB.open( dbName, dbVersion );

        request.onupgradeneeded = function( ev ) {
            // ストア生成
            _db = ev.target.result;
            var store = _db.createObjectStore( dbStoreName, params.create );

            // インデックス
            if( params.index && 0 < params.index.length ) {
                params.index.forEach( function( index ) {
                    store.createIndex( index.name, index.keyPath, index.params );
                } );
            }

            ev.target.transaction.oncomplete = function() {
                onFinish();
            };
        };

        request.onsuccess = function( ev ) {
            _db = ev.target.result;
            onFinish();
        };
         
        request.onerror = function( ev ) {
            onFinish( ev.target.error );
        };
    };

    /**
     * データベースを破棄します。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.dispose = function( callback ) {
        var onFinish = ( callback || defaultCallback );

        if( _db ) {
            _db.close();
            _db = null;
        }

        var request = _indexedDB.deleteDatabase( dbName );
        request.onsuccess = function( ev ) {
            onFinish();
        };
         
        request.onerror = function( ev ) {
            console.log( 'DB [ dispose ]: Error, ' + ev.target.error );
            onFinish( ev.target.error );
        };
    };

    /**
     * データを全て消去します。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.clear = function( callback ) {
        if( !( _db ) ) { return; }

        var onFinish    = ( callback || defaultCallback );
        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.clear();

        request.onsuccess = function( ev ) {
            onFinish();
        };
     
        request.onerror = function( ev ) {
            onFinish( ev.target.error );
        };
    };

    /**
     * 全アイテムを読み取ります。
     *
     * @param {Function} callback 処理が終了した時に呼び出される関数。
     */
    this.readAll = function( callback ) {
        if( !( _db ) ) { return; }

        var onFinish    = ( callback || defaultCallback );
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
                onFinish( null, items );
            }
        };

        request.onerror = function( ev ) {
            onFinish( ev.target.error );
        };
    };

    /**
     * 全アイテムを中断されるまで読み取ります。
     *
     * @param {Function} callback アイテムが 1 件、読み込まれるごとに呼び出される関数。true を返すと次の値を読み取ります。
     */
    this.readSome = function( callback ) {
        if( !( _db ) ) { return; }

        var onFinish    = ( callback || defaultCallback );
        var transaction = _db.transaction( dbStoreName, 'readonly' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.openCursor();

        request.onsuccess = function( ev ) {
            var cursor = ev.target.result;
            if( cursor ) {
                if( onFinish( null, cursor.value ) ) {
                    cursor.continue();
                }
            } else {
                onFinish( null, cursor.value );
            }
        };

        request.onerror = function( ev ) {
            onFinish( ev.target.error );
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

        var onFinish    = ( callback || defaultCallback );
        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.put( item );

        request.onsuccess = function( ev ) {
            item.id = ev.target.result;
            onFinish( null, item );
        };
     
        request.onerror = function( ev ) {
            onFinish( ev.target.error, item );
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

        var onFinish    = ( callback || defaultCallback );
        var transaction = _db.transaction( dbStoreName, 'readwrite' );
        var store       = transaction.objectStore( dbStoreName );
        var request     = store.delete( id );

        request.onsuccess = function( ev ) {
            onFinish( null, id );
        };
     
        request.onerror = function( wv ) {
            onFinish( ev.target.error, id );
        };
    };
};

module.exports = DBStore;