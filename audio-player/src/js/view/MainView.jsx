var React = require( 'react' );

/**
 * アプリケーションのメイン UI を描画します。
 *
 * @param {ReactClass} component          メイン UI コンポーネント。
 * @param {ReactClass} ToolbarViewModel   ツールバー用コンポーネント。
 * @param {ReactClass} MusicListViewModel 音楽リスト用コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
module.exports = function( component, ToolbarViewModel, MusicListViewModel ) {
    return (
        <article className="app">
            <ToolbarViewModel player={component.state.player} />
            <MusicListViewModel
                musics={component.state.musics}
                current={component.state.current} />
        </article>
    );
};