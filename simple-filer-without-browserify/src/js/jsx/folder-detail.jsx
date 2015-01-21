var React = require( 'react' );

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
        var fileutil  = require( '../file-utility' );

        var items = this.props.items.map( function( item, index ) {
            var style = ( item === this.state.selectedItem ? 'selected' : '' );
            var icon  = ( item.isDirectory ? 'icon-folder' : 'icon-file' );
            var type  = fileutil.getItemType( item );
            var size  = fileutil.bytesToSize( item.size );
            var mode  = fileutil.getPermissionString( item.mode, item.isDirectory );
            var date  = fileutil.dateToString( item.mtime );

            return (
                <tr
                    key={index}
                    className={style}
                    onClick={this.onClickItem.bind( this, item )}
                    onDoubleClick={this.onDoubleClickItem.bind( this, item )}>
                    <td><i className={icon}></i> {item.name}</td>
                    <td>{type}</td>
                    <td>{size}</td>
                    <td>{mode}</td>
                    <td>{date}</td>
                </tr>
            );
        }, this );

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
            var fileutil  = require( '../file-utility' );
            fileutil.shellOpenItem( item.path );
        }
    }
} );

module.exports = FolderDetail;
