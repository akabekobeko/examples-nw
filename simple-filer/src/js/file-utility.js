module.exports = {
    /**
     * フォルダ内のアイテムを列挙します。
     *
     * @param {String}   folderPath フォルダのパス。
     * @param {Function} onEnd      フォルダを列挙し終えたことを通知するコールバック関数。
     * @param {Boolean}  withFiles  ファイルも列挙する場合は true。既定はフォルダのみ。
     */
    enumItemsAtFolder: function( folderPath, onEnd, withFiles ) {
        folderPath += '/';

        var fs = require( 'fs' );
        fs.readdir( folderPath, function( err, files ) {
            if( err ) {
                console.log( err );
                onEnd( [] );
                return;
            }

            var items = [];
            files.forEach( function( file, index ) {
                function createItem() {
                    if( file.lastIndexOf( '.', 0 ) === 0 ) { return null; }

                    var path        = folderPath + file;
                    var stat        = fs.statSync( path );
                    var isDirectory = stat.isDirectory();
                    if( !( withFiles || isDirectory ) ) { return null; }

                    return {
                        name:        file,
                        path:        path,
                        size:        stat.size,
                        mtime:       stat.mtime,
                        isDirectory: isDirectory
                    };
                }

                var item = createItem();
                if( item ) {
                    items.push( item );
                }

                if( index === files.length - 1 ) {
                    onEnd( items );
                }
            } );
        } );
    },
    /**
     * ファイル サイズに単位を付与した文字列を取得します。
     *
     * @param {Number} size ファイル サイズ。
     *
     * @return {String} 単位付きのファイル サイズ文字列。TB を超えるサイズの場合は '--' を返します。
     */
    fileSizeToString: function( size ) {
        if( size < 1024 ) { return size + 'Byte'; }

        var units = [ 'KB', 'MB', 'GB', 'TB' ];
        for( var i = 0, max = units.length; i <= max; ++i  ) {
            var unitSize = Math.pow( 1024, i + 2 );
            if( size < unitSize ) {
                size = Math.round( size / Math.pow( 1024, i + 1 ) );
                return size + units[ i ];
            }
        }

        return '--';
    }
};
