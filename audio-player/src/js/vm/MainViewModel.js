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
    this.props.audioPlayerStore.onChange( this.__onChangeAudioPlayer );
    this.props.musicListStore.onChange( this.__onChangeMusicList );
    this.props.musicListAction.init();
  }

  /**
   * コンポーネント配置が解除される時に発生します。
   */
  componentWillUnmount() {
    this.props.audioPlayerStore.removeChangeListener( this.__onChangeAudioPlayer );
    this.props.musicListStore.removeChangeListener( this.__onChangeMusicList );
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
          musicListAction={ this.props.musicListAction }
          musicListStore={ this.props.musicListStore }
          audioPlayerAction={ this.props.audioPlayerAction }
          current={ this.state.current }
          currentPlay={ this.state.currentPlay }
          playState={ this.state.playState }
          duration={ this.state.duration }
          playbackTime={ this.state.playbackTime }
          volume={ this.state.volume }
           />
        <MusicListViewModel
          musicListAction={ this.props.musicListAction }
          audioPlayerAction={ this.props.audioPlayerAction }
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
      currentPlay:  this.props.audioPlayerStore.current,
      playState:    this.props.audioPlayerStore.playState,
      duration:     this.props.audioPlayerStore.duration,
      playbackTime: this.props.audioPlayerStore.playbackTime,
      volume:       this.props.audioPlayerStore.volume
    } );
  }

  /**
   * 音楽リストが更新された時に発生します。
   */
  _onChangeMusicList() {
    if( this.state.playState === PlayState.Stopped ) {
      this.setState( {
        musics:      this.props.musicListStore.musics,
        current:     this.props.musicListStore.current,
        currentPlay: this.props.audioPlayerStore.current
      } );
    } else {
      this.setState( {
        musics:  this.props.musicListStore.musics,
        current: this.props.musicListStore.current
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
    <MainViewModel
      audioPlayerAction={ context.audioPlayerAction }
      audioPlayerStore={ context.audioPlayerStore }
      musicListAction={ context.musicListAction }
      musicListStore={ context.musicListStore }
     />,
    document.querySelector( selector )
  );
}
