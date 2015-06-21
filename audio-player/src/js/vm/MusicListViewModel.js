import React              from 'react';
import ObjectAssign       from 'object-assign';
import MusicListActions   from '../model/actions/MusicListActions.js';
import AudioPlayerActions from '../model/actions/AudioPlayerActions.js';
import MusicListView      from'../view/MusicListView.js';
import {PlayState}        from '../model/constants/AudioPlayerConstants.js';

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
      playing:       ( this.props.playState !== PlayState.STOPPED ),
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
    MusicListActions.select( music );
  }

  /**
   * 音楽が再生対象として選択された時に発生します。
   *
   * @param {Object} music 音楽。
   */
  _onSelectPlay( music ) {
    AudioPlayerActions.play( music );
  }
}
