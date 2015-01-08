
/**
 * フォルダー ツリーとなるコンポーネントです。
 */
var FolderTree = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            expanded: false,
            enumerated: false
        };
    },
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        var subFolders  = null;
        if( this.state.subFolders ) {
            var onSelectFolder = this.props.onSelectFolder;
            subFolders = this.state.subFolders.map( function( item, index ) {
                return ( <li key={index}><FolderTree name={item.name} path={item.path} onSelectFolder={onSelectFolder} /></li> );
            } );
        }

        var style = this.state.expanded ? {} : { display: 'none' };
        var mark  = this.state.expanded ? 'icon-arrow-down' : 'icon-arrow-right';
        return (
            <div>
                <div onClick={this.onClick}>
                    <i className={mark}></i>
                    <i className="icon-folder"></i>
                    <span>{this.props.name}</span>
                </div>
                <ul style={style}>
                    {subFolders}
                </ul>
            </div>
        );
    },
    /**
     * アイテムがクリックされた時に発生します。
     */
    onClick: function() {
        if( this.state.enumerated ) {
            this.setState( { expanded: !this.state.expanded } );
            this.props.onSelectFolder( this.props.path );

        } else {
            this.setState( { enumerated: true } );

            var component = this;
            var fileutil  = require( './file-utility.js' );

            fileutil.enumItemsAtFolder( this.props.path, function( subFolders ) {
                component.setState( {
                    subFolders: subFolders,
                    expanded: !component.state.expanded
                } );

                component.props.onSelectFolder( component.props.path );
            } );
        }
    }
} );

module.exports = FolderTree;
