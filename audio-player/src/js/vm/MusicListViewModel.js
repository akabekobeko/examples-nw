import React         from 'react';
import ObjectAssign  from 'object-assign';
import Util          from '../util/Utility.js';
import { PlayState } from '../stores/AudioPlayerStore.js';

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
function renderItem( comp, index, music, selected, playing ) {
  return (
    <tr
      key={ music.id }
      className={ ( selected ? 'selected' : null ) }
      onClick={ comp.onSelectMusic.bind( comp.self, music ) }
      onDoubleClick={ comp.onSelectPlay.bind( comp.self, music ) }>
      <td>
        { ( playing ? ( <i className="icon-speaker"></i> ) : null ) }
      </td>
      <td className="number">{ index + 1 }</td>
      <td className="title">{ music.title }</td>
      <td>{ music.artist }</td>
      <td>{ music.album }</td>
      <td>{ Util.secondsToString( music.duration ) }</td>
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
export function MusicListView( comp ) {
  const items = comp.musics.map( ( music, index ) => {
    const selected = ( comp.current && comp.current.id === music.id );
    const playing  = ( comp.playing && comp.currentPlay && comp.currentPlay.id === music.id  );
    return renderItem( comp, index, music, selected, playing );
  } );

  const style = { width: '1em' };
  return (
    <div className="music-list">
      <table className="music-list__musics">
        <thead>
          <tr>
            <th style={ style }></th>
            <th>#</th>
            <th>Title</th>
            <th>Artis</th>
            <th>Album</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          { items }
        </tbody>
      </table>
    </div>
  );
}

/**
 * 音楽リストの Model - View を仲介するコンポーネントです。
 *
 * @type {ReactClass}
 */
 export default class MusicListViewModel extends React.Component {
  /**
   * コンポーネントを初期化します。
   *
   * @param {Object} props プロパティ。
   */
  constructor( props ) {
    super( props );
  }

  /**
   * コンポーネントを描画します。
   *
   * @return {Object} React エレメント。
   */
  render() {
    return MusicListView( ObjectAssign( {}, this.props, {
      self:          this,
      playing:       ( this.props.playState !== PlayState.Stopped ),
      onSelectMusic: this._onSelectMusic,
      onSelectPlay:  this._onSelectPlay
    } ) );
  }

  /**
   * 音楽が選択された時に発生します。
   *
   * @param {Object} music 音楽。
   */
  _onSelectMusic( music ) {
    this.props.musicListAction.select( music );
  }

  /**
   * 音楽が再生対象として選択された時に発生します。
   *
   * @param {Object} music 音楽。
   */
  _onSelectPlay( music ) {
    this.props.audioPlayerAction.play( music );
  }
}
