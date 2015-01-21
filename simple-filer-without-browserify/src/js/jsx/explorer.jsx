var React        = require( 'react' );
var FolderTree   = require( './folder-tree' );
var FolderDetail = require( './folder-detail' );

/**
 * ファイル、フォルダのビューアーです。
 */
var Explorer = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        var fileutil = require( '../file-utility' );
        return {
            currentFolder: fileutil.getUserHomeDir(),
            items: []
        };
    },
    /**
     * コンポーネントが DOM ツリーへ追加された時に発生します。
     */
    componentWillMount: function() {
        this.updateFolderDetail( this.state.currentFolder );
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
                    <FolderTree name="HOME" path={this.state.currentFolder} onSelectFolder={this.onSelectFolder} />
                </div>
                <div className="folder-detail">
                    <FolderDetail items={this.state.items} />
                </div>
            </div>
        );
    },
    /**
     * フォルダ詳細を更新します。
     *
     * @param  {String} folder 新たに選択されたフォルダ。
     */
    updateFolderDetail: function( folder ) {
        var fileutil  = require( '../file-utility' );
        var component = this;

        fileutil.enumItemsAtFolder(
            folder,
            function( items ) {
                items.sort( function( a, b ) {
                    return ( a.isDirectory === b.isDirectory ? a.name.localeCompare( b.name ) : ( a.isDirectory ? -1 : 1 ) );
                } );

                component.setState( { currentFolder: folder, items: items } );
            },
            true
        );
    },
    /**
     * フォルダが選択された時に発生します。
     *
     * @param  {String} folder 選択されたフォルダ。
     */
    onSelectFolder: function( folder ) {
        if( folder !== this.state.currentFolder ) {
            this.updateFolderDetail( folder );
        }
    }
} );

module.exports = function( target ) {
    React.render(
        <Explorer />,
        document.querySelector( target )
    );
};
