
/**
 * サブフォルダを列挙します。
 *
 * @param {String}   folderPath フォルダのパス。
 * @param {Function} onEnd      フォルダを列挙し終えたことを通知するコールバック関数。
 */
function enumSubFolders( folderPath, onEnd ) {
    folderPath += '/';

    var fs = require( 'fs' );
    fs.readdir( folderPath, function( err, items ) {
        if( err ) {
            console.log( err );
            return;
        }

        var subFolders = [];
        items
            .filter( function( item ) {
                // 表示対象となるフォルダのみを対象とする
                return ( item.lastIndexOf( '.' ) !== 0 && fs.statSync( folderPath + item ).isDirectory() );
            } )
            .forEach( function( item, index, arr ) {
                subFolders.push( { name: item, path: folderPath + item } );

                if( index === arr.length - 1 ) {
                    onEnd( subFolders );
                }
            } );
    } );
}

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
            subFolders = this.state.subFolders.map( function( item, index ) {
                return ( <li key={index}><FolderTree name={item.name} path={item.path} /></li> );
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
            // ここでフォルダ内表示を更新する
            this.setState( { expanded: !this.state.expanded } );
        } else {
            this.setState( { enumerated: true } );

            var component = this;
            enumSubFolders( this.props.path, function( subFolders ) {
                component.setState( {
                    subFolders: subFolders,
                    expanded: !component.state.expanded
                } );
            } );
        }
    }
} );

module.exports = FolderTree;

