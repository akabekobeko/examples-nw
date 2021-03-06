
/**
 * アイテム種別を取得します。
 *
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function getItemType( item ) {
    if( item.isDirectory ) { return 'Folder'; }

    var path = nequire( 'path' );
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
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            selectedItem: null
        };
    },
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        var fileutil  = require( './file-utility.js' );
        var component = this;

        var items = this.props.items.map( function( item, index ) {
            var style = ( item === component.state.selectedItem ? 'selected' : '' );
            var icon  = ( item.isDirectory ? 'icon-folder' : 'icon-file' );
            var type  = getItemType( item );
            var size  = fileutil.bytesToSize( item.size );
            var mode  = fileutil.getPermissionString( item.mode, item.isDirectory );
            var date  = dateToString( item.mtime );

            return (
                <tr
                    className={style}
                    onClick={component.onClickItem.bind( this, item )}
                    onDoubleClick={component.onDoubleClickItem.bind( this, item )}>
                    <td><i className={icon}></i> {item.name}</td>
                    <td>{type}</td>
                    <td>{size}</td>
                    <td>{mode}</td>
                    <td>{date}</td>
                </tr>
            );
        } );

        return (
            <table className="items">
                <thead>
                    <tr><th>Name</th><th>Type</th><th>Size</th><th>Permission</th><th>Modified</th></tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
        );
    },
    /**
     * アイテムがクリックされた時に発生します。
     *
     * @param {Object} アイテム情報。
     */
    onClickItem: function( item ) {
        this.setState( { selectedItem: item } );
    },
    /**
     * アイテムがダブル クリックされた時に発生します。
     *
     * @param {Object} アイテム情報。
     */
    onDoubleClickItem: function( item ) {
        if( item.isDirectory ) {
            // ここでフォルダ ツリーに変更通知して展開させたい

        } else {
            var gui = nequire( 'nw.gui' );
            gui.Shell.openItem( item.path );
        }
    }
} );

module.exports = FolderDetail;
