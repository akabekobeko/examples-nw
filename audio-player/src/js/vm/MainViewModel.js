import React              from 'react';
import { PlayState }      from '../stores/AudioPlayerStore.js';
import ToolbarViewModel   from './ToolbarViewModel.js';
import MusicListViewModel from './MusicListViewModel.js';

/**
 * アプリケーションのメイン ウィンドウとなるコンポーネントです。
 *
 * @type {ReactClass}
 */
export default class MainViewModel extends React.Component {
  /**
   * コンポーネントを初期化します。
   *
   * @param {Object} props プロパティ。
   */
  constructor( props ) {
    super( props );

    this.state = {
      musics:       [],
      current:      null,
      currentPlay:  null,
      playState:    PlayState.Stopped,
      duration:     0,
      playbackTime: 0,
      volume:       100
    };

    // Store の館対象となる bind 済み Listener を一意にするためのフィールド
    this.__onChangeAudioPlayer = this._onChangeAudioPlayer.bind( this );
    this.__onChangeMusicList   = this._onChangeMusicList.bind( this );
  }

  /**
   * コンポーネントが配置される時に発生します。
   */
  componentDidMount() {
    this.props.context.audioPlayerStore.onChange( this.__onChangeAudioPlayer );
    this.props.context.musicListStore.onChange( this.__onChangeMusicList );
    this.props.context.musicListAction.init();
  }

  /**
   * コンポーネント配置が解除される時に発生します。
   */
  componentWillUnmount() {
    this.props.context.audioPlayerStore.removeChangeListener( this.__onChangeAudioPlayer );
    this.props.context.musicListStore.removeChangeListener( this.__onChangeMusicList );
  }

  /**
   * コンポーネントを描画します。
   *
   * @return {Object} React エレメント。
   */
  render() {
    return (
      <article className="app">
        <ToolbarViewModel
          context={ this.props.context }
          current={ this.state.current }
          currentPlay={ this.state.currentPlay }
          playState={ this.state.playState }
          duration={ this.state.duration }
          playbackTime={ this.state.playbackTime }
          volume={ this.state.volume }
           />
        <MusicListViewModel
          context={ this.props.context }
          musics={ this.state.musics }
          current={ this.state.current }
          currentPlay={ this.state.currentPlay }
          playState={ this.state.playState } />

      </article>
    );
  }

  /**
   * 音楽プレーヤーが更新された時に発生します。
   */
  _onChangeAudioPlayer() {
    this.setState( {
      currentPlay:  this.props.context.audioPlayerStore.current,
      playState:    this.props.context.audioPlayerStore.playState,
      duration:     this.props.context.audioPlayerStore.duration,
      playbackTime: this.props.context.audioPlayerStore.playbackTime,
      volume:       this.props.context.audioPlayerStore.volume
    } );
  }

  /**
   * 音楽リストが更新された時に発生します。
   */
  _onChangeMusicList() {
    if( this.state.playState === PlayState.Stopped ) {
      this.setState( {
        musics:      this.props.context.musicListStore.musics,
        current:     this.props.context.musicListStore.current,
        currentPlay: this.props.context.audioPlayerStore.current
      } );
    } else {
      this.setState( {
        musics:  this.props.context.musicListStore.musics,
        current: this.props.context.musicListStore.current
      } );
    }
  }
}

/**
 * メイン ウィンドウ用コンポーネントを設定します。
 *
 * @param {AppContext} context  コンテキスト。
 * @param {String}     selector コンポーネントを配置する要素のセレクター。
 */
export function SetupMainViewModel( context, selector ) {
  React.render(
    <MainViewModel context={ context } />,
    document.querySelector( selector )
  );
}
