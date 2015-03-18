
/**
 * 音楽情報リストを管理します。
 */
var MusicList = function() {
    /**
     * オーディオ要素。
     * @type {Element}
     */
    var _audioElement = document.createElement( 'audio' );

    /**
     * データベース。
     * @type {PouchDB}
     */
    var _db = new ( require( './IndexedDBWrapper.js' ) )( 'music_db', 1, 'musics' );

    /**
     * データベースを初期化します。
     *
     * @param  {Function} callback 初期化が完了した時に呼び出される関数。
     */
    this.init = function( callback ) {
        var params = {
            create: {
                keyPath: 'id',
                autoIncrement: true
            },
            index: [
                { name: 'path', keyPath: 'path', params: { unique: true } }
            ]
        };

        _db.open( params, function( err ) {
            callback( err );
        } );
    };

    /**
     * 音声ファイルを追加します。
     *
     * @param {File}     file     ファイル情報。input[type="file"] で読み取った情報を指定してください。
     * @param {Function} callback 処理が完了した時に呼び出される関数。
     */
    this.add = function( file, callback ) {
        _readMetadata( file, function( err, music ) {
            if( err ) {
                callback( err );

            } else {
                _db.add( music, callback );
            }
        } );
    };

    /**
     * 音楽情報を削除します。
     *
     * @param {Number}   musicId  削除対象となる音楽情報の識別子。
     * @param {Function} callback コールバック関数。
     */
    this.remove = function( musicId, callback ) {
        _db.remove( musicId, callback );
    };

    /**
     * 全ての曲を読み取ります。
     *
     * @param {Function} callback 処理が完了した時に呼び出される関数。
     */
    this.readAll = function( callback ) {
        _db.readAll( callback );
    };

    /**
     * 音声ファイルのメタデータを読み取ります。
     *
     * @param {File}     file     ファイル情報。input[type="file"] で読み取った情報を指定してください。
     * @param {Function} callback 処理が完了した時に呼び出される関数。
     */
    function _readMetadata( file, callback ) {
        // MIME チェック
        if( !( _audioElement.canPlayType( file.type ) ) ) {
            callback( new Error( 'Unsupported type "' + file.type + '".' ) );
            return;
        }

        var mm     = window.require( 'musicmetadata' );
        var fs     = window.require( 'fs' );
        var stream = fs.createReadStream( file.path );

        mm( stream, { duration: true }, function( err, metadata ) {
            if( err ) {
                callback( err );

            } else {
                callback( null, {
                    type:     file.type,
                    path:     file.path,
                    title:    metadata.title || '',
                    artist:   ( 0 < metadata.artist.length ? metadata.artist[ 0 ] : '' ),
                    album:    metadata.album || '',
                    duration: metadata.duration
                } );
            }
        } );
    }
};

module.exports = MusicList;