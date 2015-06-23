import React         from 'react';
import ObjectAssign  from 'object-assign';
import { PlayState } from '../stores/AudioPlayerStore.js';
import ToolbarView   from '../view/ToolbarView.js';

/**
 * ツールバー用コンポーネントです。
 *
 * @type {ReactClass}
 */
export default class ToolbarViewModel extends React.Component {
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
    return ToolbarView( ObjectAssign( {}, this.props, {
      self:             this,
      onPressButton:    this._onPressButton,
      onVolumeChange:   this._onVolumeChange,
      onPositionChange: this._onPositionChange
    } ) );
  }

  /**
   * ボタンが押された時に発生します。
   *
   * @param {String} type ボタン種別。
   */
  _onPressButton( type ) {
    switch( type ) {
      case 'play':
      this._play();
      break;

      case 'pause':
      this.props.audioPlayerAction.pause();
      break;

      case 'prev':
      this._moveNext( true );
      break;

      case 'next':
      this._moveNext();
      break;

      case 'add':
      this.props.musicListAction.add();
      break;

      case 'remove':
      this._remove();
      break;
    }
  }

  /**
   * 音量が変更された時に発生します。
   *
   * @param  {Object} ev イベント情報。
   */
  _onVolumeChange( ev ) {
    this.props.audioPlayerAction.volume( ev.target.value );
  }

  /**
   * 再生位置が変更された時に発生します。
   *
   * @param  {Object} ev イベント情報。
   */
  _onPositionChange( ev ) {
    this.props.audioPlayerAction.seek( ev.target.value );
  }

  /**
   * 曲を再生します。
   */
  _play() {
    if( this.props.playState === PlayState.Stopped ) {
      this.props.audioPlayerAction.play( this.props.currentPlay );
    } else {
      this.props.audioPlayerAction.play();
    }
  }

  /**
   * 曲選択を変更します。
   *
   * @param  {Boolan} prev 前の曲を選ぶなら true。
   */
  _moveNext( prev ) {
    let music = this.props.musicListStore.next( this.props.currentPlay, prev );
    if( !( music ) ) { return; }

    if( this.props.playState === PlayState.Stopped ) {
      this.props.musicListAction.select( music );
    } else {
      this.props.audioPlayerAction.play( music );
    }
  }

  /**
   * 選択している曲を削除します。
   */
  _remove() {
    // リスト上の曲を対象とする
    const current = this.props.current;
    if( !( current ) ) { return; }

    const currentPlay = this.props.currentPlay;
    if( currentPlay && currentPlay.id === current.id ) {
      if( this.props.playState === PlayState.Stopped ) {
        this.props.musicListAction.remove( current.id );
      } else {
        console.error( 'Failed to remove the music, is playing.' );
      }

    } else {
      this.props.musicListAction.remove( current.id );
    }
  }
}
