var React    = require( 'react' );
var TextUtil = require( '../model/util/TextUtility.js' );

/**
 * 音楽リスト用コンポーネントを描画します。
 *
 * @param {ReactClass} component コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
module.exports = function( component ) {
    var items = component.props.musics.map( function( music, index ) {
        var selected = ( component.props.current && component.props.current.id === music.id ? 'selected' : null );
        return item( component, index, music, selected );
    }, component );

    return (
        <div className="music-list">
            <table className="musics">
                <thead>
                    <tr><th>#</th><th>Title</th><th>Artis</th><th>Album</th><th>Duration</th></tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
        </div>
    );
};

/**
 * 音楽リストのアイテムを描画します。
 *
 * @param {ReactClass} component コンポーネント。
 * @param {Numbet}     index     リスト上のインデックス。
 * @param {Music}      music     音楽情報。
 * @param {Boolean}    selected  音楽情報が選択されているなら true。
 *
 * @return {ReactElement}  React エレメント。
 */
function item( component, index, music, selected ) {
    return (
        <tr 
            key={music.id}
            className={selected}
            onClick={component._onSelectMusic.bind( component, music )}
            onDoubleClick={component._onSelectPlay.bind( component, music )}>
            <td className="number">{index + 1}</td>
            <td>{music.title}</td>
            <td>{music.artist}</td>
            <td>{music.album}</td>
            <td>{TextUtil.secondsToString( music.duration )}</td>
        </tr>
    );
}
