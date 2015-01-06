var ITEM_TYPE_FOLDER = 'folder';
var ITEM_TYPE_FILE = 'file';

/**
 * フォルダ内のアイテムを列挙します。
 *
 * @param {Object} component コンポーネント。
 */
function enumSubItems( component ) {
    var dir = component.props.path + '/';

    var fs = require( 'fs' );
    fs.readdir( dir, function( err, items ) {
        if( err ) {
            console.log( err );
            return;
        }

        var children = [];
        items.forEach( function( item, index ) {
            // 隠しファイル、フォルダは除外
            if( item.lastIndexOf( '.' ) !== 0 ) {
                var path = dir + item;
                var type = fs.statSync( path ).isDirectory() ? ITEM_TYPE_FOLDER : ITEM_TYPE_FILE;
                children.push( { name: item, type: type, path: path } );
            }

            if( index === items.length - 1 ) {
                // フォルダを先頭にする
                children.sort( function( a, b ) {
                    if( a.type === ITEM_TYPE_FOLDER && b.type === ITEM_TYPE_FILE ) {
                        return -1;
                    } else if( b.type === ITEM_TYPE_FOLDER && a.type === ITEM_TYPE_FILE ) {
                        return 1;
                    }

                    return 0;
                } );

                component.setState( { children: children } );
            }
        } );
    } );
}

/**
 * フォルダ用の描画オブジェクトを取得します。
 *
 * @param {Object} component コンポーネント。
 *
 * @return {Object} 描画オブジェクト。
 */
function renderFolder( component ) {
    var children  = null;
    if( component.state.children ) {
        children = component.state.children.map( function( item, index ) {
            return ( <li key={index}><Explorer name={item.name} type={item.type} path={item.path} /></li> );
        } );
    }

    var style = component.state.expanded ? {} : { display: 'none' };
    var mark  = component.state.expanded ? 'icon-arrow-down' : 'icon-arrow-right';
    var icon  = 'icon-folder';
    return (
        <div>
            <div onClick={component.onClick}>
                <i className={mark}></i>
                <i className={icon}></i>
                <span>{component.props.name}</span>
            </div>
            <ul style={style}>
                {children}
            </ul>
        </div>
    );
}

/**
 * ファイル用の描画オブジェクトを取得します。
 *
 * @param {Object} component コンポーネント。
 *
 * @return {Object} 描画オブジェクト。
 */
function renderFile( component ) {
    var icon = 'icon-file';
    return (
        <div onClick={component.onClick}>
            <i className={icon}></i>
            <span>{component.props.name}</span>
        </div>
    );
}

var Explorer = React.createClass( {
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
        return ( this.props.type === ITEM_TYPE_FOLDER ? renderFolder( this ) : renderFile( this ) );
    },

    /**
     * アイテムがクリックされた時に発生します。
     */
    onClick: function() {
        if( this.props.type === ITEM_TYPE_FOLDER ) {
            if( !this.state.enumerated ) {
                this.setState( { enumerated: true } );
                enumSubItems( this );
                //this.setState( { children: getSubItems( this.props.path ) } );
            }

            this.setState( { expanded: !this.state.expanded } );
        }
    }
} );

module.exports = function( target ) {
    React.render(
        <Explorer name="root" type="folder" path="" />,
        document.querySelector( target )
    );
};
