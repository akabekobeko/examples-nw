
var FolderTree   = require( './folder-tree.jsx' );
var FolderDetail = require( './folder-detail.jsx' );

var Explorer = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            currentFolder: "",
            items: []
        };
    },
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        return (
            <div className="explorer">
                <div className="folder-tree">
                    <FolderTree name="root" path="" onSelectFolder={this.onSelectFolder} />
                </div>
                <div className="folder-detail">
                    <FolderDetail items={this.state.items} />
                </div>
            </div>
        );
    },
    /**
     * フォルダが選択された時に発生します。
     *
     * @param  {String} path 選択されたフォルダ。
     */
    onSelectFolder: function( path ) {
        if( path === this.state.currentFolder ) { return; }

        var fileutil  = require( './file-utility.js' );
        var component = this;
        fileutil.enumItemsAtFolder( path, function( items ) {
            // フォルダを先頭にする
            items.sort( function( a, b ) {
                return ( a.isDirectory && b.isDirectory ? 0 : ( a.isDirectory ? -1 : 1 ) );
            } );

            component.setState( { currentFolder: path, items: items } );
        }, true );
    }
} );

module.exports = function( target ) {
    React.render(
        <Explorer />,
        document.querySelector( target )
    );
};
