
/**
 * アイテム情報を生成します。
 *
 * @param {String} folderPath 親フォルダのパス。
 * @param {String} name       アイテム名。
 *
 * @return {Object} アイテム情報。
 */
function createItem( folderPath, name ) {
    if( name.lastIndexOf( '.', 0 ) === 0 ) { return null; }

    var path        = folderPath + name;
    var stat        = fs.statSync( path );
    var isDirectory = stat.isDirectory();
    if( !( withFiles || isDirectory ) ) { return null; }

    return {
        name:        name,
        path:        path,
        size:        stat.size,
        mtime:       stat.mtime,
        isDirectory: isDirectory
    };
}

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
        fs.readdir( folderPath, function( err, names ) {
            if( err ) {
                console.log( err );
                onEnd( [] );
                return;
            }

            var items = [];
            names.forEach( function( name, index ) {
                function createItem() {
                    if( name.lastIndexOf( '.', 0 ) === 0 ) { return null; }

                    var path        = folderPath + name;
                    var stat        = fs.statSync( path );
                    var isDirectory = stat.isDirectory();
                    if( !( withFiles || isDirectory ) ) { return null; }

                    return {
                        name:        name,
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

                if( index === names.length - 1 ) {
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
    },
    /**
     * ユーザーのホームディレクトリを取得します。
     * http://stackoverflow.com/questions/9080085/node-js-find-home-directory-in-platform-agnostic-way
     *
     * @return {String} ホームディレクトリのパス。
     */
    getUserHomeDir: function() {
        return process.env[ ( process.platform == 'win32' ) ? 'USERPROFILE' : 'HOME' ];
    }
};
