
var FolderTree = require( './folder-tree.jsx' );

module.exports = function( target ) {
    React.render(
        (
            <div className="explorer">
                <div className="folder-tree">
                    <FolderTree name="root" path="" />
                </div>
            </div>
        ),
        document.querySelector( target )
    );
};
