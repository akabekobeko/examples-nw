import React from 'react';
import Util  from '../model/util/Utility.js';

/**
 * 曲が再生中であることを示すアイコンを描画します。
 *
 * @return {ReactElement} React エレメント。
 */
function playingMarker() {
  return ( <i className="icon-speaker"></i> );
}

/**
 * 音楽リストのアイテムを描画します。
 *
 * @param {Object}  comp     コンポーネント。
 * @param {Numbet}  index    リスト上のインデックス。
 * @param {Music}   music    音楽情報。
 * @param {Boolean} selected 曲がリスト上で選択されているなら true。
 * @param {Boolean} playing  曲が再生中なら true。
 *
 * @return {ReactElement} React エレメント。
 */
function item( comp, index, music, selected, playing ) {
  return (
    <tr
      key={music.id}
      className={selected ? 'selected' : null}
      onClick={comp.onSelectMusic.bind( comp.self, music )}
      onDoubleClick={comp.onSelectPlay.bind( comp.self, music )}>
      <td>{playing ? playingMarker() : null}</td>
      <td className="number">{index + 1}</td>
      <td className="title">{music.title}</td>
      <td>{music.artist}</td>
      <td>{music.album}</td>
      <td>{Util.secondsToString( music.duration )}</td>
    </tr>
  );
}

/**
 * 音楽リスト用コンポーネントを描画します。
 *
 * @param {Object} comp コンポーネント。
 *
 * @return {ReactElement} React エレメント。
 */
export default ( comp ) => {
  let items = comp.musics.map( ( music, index ) => {
    let selected = ( comp.current && comp.current.id === music.id );
    let playing  = ( comp.playing && comp.currentPlay && comp.currentPlay.id === music.id  );
    return item( comp, index, music, selected, playing );
  }, comp.self );

  let style = { width: '1em' };
  return (
    <div className="music-list">
      <table className="musics">
        <thead>
          <tr>
            <th style={style}></th>
            <th>#</th>
            <th>Title</th>
            <th>Artis</th>
            <th>Album</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  );
};
