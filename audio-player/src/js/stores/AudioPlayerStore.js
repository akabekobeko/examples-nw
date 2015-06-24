import { Store }   from 'material-flux';
import { Keys }    from '../actions/AudioPlayerAction.js';
import AudioPlayer from '../model/AudioPlayer.js';

/**
 * 音声プレーヤーの再生状態を定義します。
 * @type {Object}
 */
export const PlayState = {
  /** 停止されている。 */
  Stopped: 0,

  /** 再生中。 */
  Playing: 1,

  /** 一時停止されている。 */
  Paused: 2
};

/**
 * 音声プレーヤーを操作します。
 * このクラスはシングルトンとして実装されます。
 *
 * @type {AudioPlayerStore}
 */
export default class AudioPlayerStore extends Store {
  /**
   * インスタンスを初期化します。
   *
   * @param {Context}        context        コンテキスト。
   * @param {MusicListStore} musicListStore 音楽リスト。
   */
  constructor( context, musicListStore ) {
    super( context );

    this.register( Keys.play,     this._actionPlay     );
    this.register( Keys.pause,    this._actionPause    );
    this.register( Keys.stop,     this._actionStop     );
    this.register( Keys.seek,     this._actionSeek     );
    this.register( Keys.volume,   this._actionVolume   );
    this.register( Keys.unselect, this._actionUnselect );

    /**
     * 変更監視される値。
     * @type {Object}
     */
    this.state = {
      /**
       * 再生対象となる音楽情報。
       * @type {Music}
       */
      current: null,

      /**
       * 再生状態。
       * @type {PlayState}
       */
      playState: PlayState.Stopped
    };

    /**
     * 音声プレーヤー。
     * @type {AudioPlayer}
     */
    this._audioPlayer = new AudioPlayer();

    /**
     * 音楽リスト。
     * @type {MusicListStore}
     */
    this._musicListStore = musicListStore;

    /**
     * 再生時間と演奏終了を監視するためのタイマー。
     * @type {Number}
     */
    this._timer = null;
  }

  /**
   * 再生対象となる音楽情報を取得します。
   *
   * @return {Music} 音楽情報。
   */
  get current() {
    return this.state.current;
  }

  /**
   * 再生状態を示す値を取得します。
   *
   * @return {PlayState} 再生状態。
   */
  get playState() {
    return this.state.playState;
  }

  /**
   * 演奏時間を取得します。
   *
   * @return {Number} 演奏時間 ( 秒単位 )。
   */
  get duration() {
    const d = this._audioPlayer.duration();
    return ( d === 0 ? ( this.state.current ? this.state.current.duration : 0 ) : d );
  }

  /**
   * 再生位置を取得します。
   *
   * @return {Number} 再生位置 ( 秒単位 )。
   */
  get playbackTime() {
    return this._audioPlayer.playbackTime();
  }

  /**
   * 音声の周波数スペクトルを取得します。
   *
   * @return {Array} スペクトル。
   */
  get spectrums() {
    return this._audioPlayer.spectrums();
  }

  /**
   * 音量を取得します。
   *
   * @return {Number} 音量。範囲は 0 〜 100 となります。
   */
  get volume() {
    return this._audioPlayer.volume();
  }

  /**
   * 再生を開始します。
   *
   * @param {Music} music 再生対象となる音楽情報。
   */
  _actionPlay( music ) {
    if( music ) {
      this._audioPlayer.openFromFile( music.path, ( err ) => {
        if( err ) {
          console.log( err.message );
        } else {
          const state = { current: music };
          if( this._audioPlayer.play() ) {
            this._playTimer();
            state.playState = PlayState.Playing;
          }

          this.setState( state );
        }
      } );

    } else if( this.state.playState !== PlayState.Playing && this._audioPlayer.play() ) {
      this._playTimer();
      this.setState( { playState: PlayState.Playing } );
    }
  }

  /**
   * 再生を一時停止します。
   */
  _actionPause() {
    if( this.state.playState === PlayState.Playing && this._audioPlayer.pause() ) {
      this._playTimer( true );
      this.setState( { playState: PlayState.Paused } );
    }
  }

  /**
   * 再生を停止します。
   * 状態管理を簡素化するため、この操作は再生状態に関わらず常に強制実行されるようにしています。
   */
  _actionStop() {
    this._playTimer( true );
    this._audioPlayer.stop();
    this.setState( { playState: PlayState.Stopped } );
  }

  /**
   * 再生位置を変更します。
   *
   * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
   *
   * @return {Boolean} 成功時は true。
   */
  _actionSeek( playbackTime ) {
    if( this._audioPlayer.seek( playbackTime ) ) {
      this.setState();
    }
  }

  /**
   * 音量を設定します。
   *
   * @param {Number} value 音量。範囲は 0 〜 100 となります。
   */
  _actionVolume( value ) {
    this._audioPlayer.setVolume( value );
    this.setState();
  }

  /**
   * 再生対象としている曲の選択状態を解除します。
   */
  _actionUnselect() {
    if( !( this.state.current ) ) { return; }

    if( this.state.playState !== PlayState.Stopped ) {
      this._actionStop();
    }

    this.setState( { current: null } );
  }

  /**
   * 再生時間と演奏終了を監視するためのタイマーを開始・停止します。
   *
   * @param {Boolean} isStop タイマーを停止させる場合は true。
   */
  _playTimer( isStop ) {
    if( isStop ) {
      clearInterval( this._timer );
    } else {
      this._timer = setInterval( () => {
        if( this._audioPlayer.duration() <= this._audioPlayer.playbackTime() ) {
          // 再生終了
          clearInterval( this._timer );
          this._actionStop();

          let music = this._musicListStore.next( this.state.current );
          if( music ) {
            // 次の曲を再生 ( 更新は play 内で通知される )
            this._actionPlay( music );
            return;
          }
        }

        // 再生時間の更新を通知
        this.setState();

      }, 1000 );
    }
  }
}
