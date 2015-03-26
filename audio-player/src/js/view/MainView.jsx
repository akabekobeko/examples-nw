var React = require( 'react' );

/**
 * アプリケーションのメイン UI を描画します。
 *
 * @param {Object} comp コンポーネント。
 *
 * @return {ReactElement}  React エレメント。
 */
module.exports = function( comp ) {
    return (
        <article className="app">
            <comp.ToolbarViewModel
                currentPlay={comp.currentPlay}
                playState={comp.playState}
                duration={comp.duration}
                playbackTime={comp.playbackTime}
                volume={comp.volume}
                 />
            <comp.MusicListViewModel
                musics={comp.musics}
                current={comp.current}
                currentPlay={comp.currentPlay}
                playState={comp.playState} />
        </article>
    );
};
