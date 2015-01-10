
/**
 * アイテム種別を取得します。
 *
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function getItemType( item ) {
    if( item.isDirectory ) { return 'Folder'; }

    //var mime = require( 'mime' );
    //return mime.lookup( item.path );

    var path = require( 'path' );
    var ext  = path.extname( item.path );
    switch( ext ) {
    case '.txt':  return 'Text';
    case '.md':   return 'Markdown';
    case '.html': return 'HTML';
    case '.css':  return 'Style Sheet';
    case '.js':   return 'JavaScript';
    case '.jpeg': return 'JPEG';
    case '.png':  return 'PNG';
    case '.gif':  return 'GIF';
    case '.mp3':  return 'MPEG3';
    case '.mp4':  return 'MPEG4';
    case '.aac':  return 'AAC';
    default:      return 'File';
    }
}

/**
 * 日時情報を文字列化します。
 *
 * @param {Date} date 日時情報。
 *
 * @return {String} 文字列。
 */
function dateToString( date ) {
    return ( date && date.toLocaleDateString ? date.toLocaleDateString() : '' );
}

/**
 * フォルダー内の詳細情報コンポーネントです。
 */
var FolderDetail = React.createClass( {
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        var fileutil = require( './file-utility.js' );

        var items = this.props.items.map( function( item, index ) {
            var icon = ( item.isDirectory ? 'icon-folder' : 'icon-file' );
            var type = getItemType( item );
            //var size = fileutil.fileSizeToString( item.size );
            var size = fileutil.bytesToSize( item.size );
            var date = dateToString( item.mtime );

            return (
                <tr>
                    <td><i className={icon}></i> {item.name}</td>
                    <td>{type}</td>
                    <td>{size}</td>
                    <td>{date}</td>
                </tr>
            );
        } );

        return (
            <table className="items">
                <thead>
                    <tr><th>Name</th><th>Type</th><th>Size</th><th>Modified</th></tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
        );
    }
} );

module.exports = FolderDetail;
