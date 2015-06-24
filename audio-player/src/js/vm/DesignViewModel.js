import React             from 'react';
import ObjectAssign      from 'object-assign';
import { ToolbarView }   from './ToolbarViewModel.js';
import { MusicListView } from './MusicListViewModel.js';
import { PlayState }     from '../stores/AudioPlayerStore.js';

/**
 * アプリケーションのエントリー ポイントになるコンポーネント ( デザイン確認用 ) です。
 *
 * @type {ReactClass}
 */
 export default class DesignViewModel extends React.Component {
  /**
   * コンポーネントを初期化します。
   *
   * @param {Object} props プロパティ。
   */
  constructor( props ) {
    super( props );

    const musics = [
      { id: 1, title: 'test1', artist: 'artist1', album: 'album1', duration: 150 },
      { id: 2, title: 'test2', artist: 'artist2', album: 'album2', duration: 120 }
    ];

    this.state = {
      // 音楽リスト
      musics:        musics,
      current:       musics[ 0 ],
      onSelectMusic: this._onSelectMusic,
      onSelectPlay:  this._onSelectPlay,

      // ツールバー
      currentPlay:      musics[ 0 ],
      playState:        PlayState.Stopped,
      duration:         musics[ 0 ].duration,
      playbackTime:     0,
      volume:           100,
      onPressButton:    this._onPressButton,
      onVolumeChange:   this._onVolumeChange,
      onPositionChange: this._onPositionChange
    };
  }

  /**
   * コンポーネントを描画します。
   *
   * @return {Object} React エレメント。
   */
  render() {
    const comp = ObjectAssign( {}, this.state, { self: this } );
    return (
      <article className="app">
        { ToolbarView( comp ) }
        { MusicListView( comp ) }
      </article>
    );
  }

  /**
   * 音楽が選択された時に発生します。
   *
   * @param {Object} music 音楽。
   */
  _onSelectMusic( music ) {
    console.log( '_onSelectMusic' );
    this.setState( { current: music, currentPlay: music, duration: music.duration } );
  }

  /**
   * 音楽が再生対象として選択された時に発生します。
   *
   * @param {Object} music 音楽。
   */
  _onSelectPlay( /*music*/ ) {
    console.log( '_onSelectPlay' );
  }

  /**
   * ボタンが押された時に発生します。
   *
   * @param {String} type ボタン種別。
   */
  _onPressButton( type ) {
    console.log( '_onPressButton: type = ' + type );
  }

  /**
   * 音量が変更された時に発生します。
   *
   * @param  {Object} ev イベント情報。
   */
  _onVolumeChange( ev ) {
    console.log( '_onVolumeChange: value = ' + ev.target.value );
    this.setState( { volume: ev.target.value } );
  }

  /**
   * 再生位置が変更された時に発生します。
   *
   * @param  {Object} ev イベント情報。
   */
  _onPositionChange( ev ) {
    console.log( '_onPositionChange: value = ' + ev.target.value );
    this.setState( { playbackTime: ev.target.value } );
  }
}

/**
 * デザイン確認用コンポーネントを設定します。
 *
 * @param {String} selector コンポーネントを配置する要素のセレクター。
 */
export function SetupDesignViewModel( selector ) {
  React.render(
    <DesignViewModel />,
    document.querySelector( selector )
  );
}
