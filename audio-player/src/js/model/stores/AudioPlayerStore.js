import {EventEmitter} from 'events';
import AppDispatcher  from '../dispatcher/AppDispatcher.js';
import {ActionTypes}  from '../constants/AudioPlayerConstants.js';
import {PlayState}    from '../constants/AudioPlayerConstants.js';
import AudioPlayer    from '../AudioPlayer.js';
import MusicListStore from './MusicListStore.js';

/**
 * 変更イベントを示す値。
 * @type {String}
 */
const CHANGE_EVENT = 'change';

/**
 * 音声プレーヤーを操作します。
 * このクラスはシングルトンとして実装されます。
 *
 * @type {AudioPlayerStore}
 */
class AudioPlayerStore extends EventEmitter {
  /**
   * インスタンスを初期化します。
   */
  constructor() {
    super();

    AppDispatcher.register( this._onAction.bind( this ) );

    /**
     * 唯一の音声プレーヤー。
     * @type {AudioPlayer}
     */
    this._audioPlayer = new AudioPlayer();

    /**
     * 再生状態。
     * @type {PlayState}
     */
    this._playState = PlayState.STOPPED;

    /**
     * 再生時間と演奏終了を監視するためのタイマー。
     * @type {Number}
     */
    this._timer = null;

    /**
     * 再生対象となる音楽情報。
     * @type {Music}
     */
    this._current = null;
  }

  /**
   * 再生対象となる音楽情報を取得します。
   *
   * @return {Music} 音楽情報。
   */
  current() {
    return this._current;
  }

  /**
   * 演奏時間を取得します。
   *
   * @return {Number} 演奏時間 ( 秒単位 )。
   */
  duration() {
    const d = this._audioPlayer.duration();
    return ( d === 0 ? ( this._current ? this._current.duration : 0 ) : d );
  }

  /**
   * 再生位置を取得します。
   *
   * @return {Number} 再生位置 ( 秒単位 )。
   */
  playbackTime() {
    return this._audioPlayer.playbackTime();
  }

  /**
   * 音声の周波数スペクトルを取得します。
   *
   * @return {Array} スペクトル。
   */
  spectrums() {
    return this._audioPlayer.spectrums();
  }

  /**
   * 音量を取得します。
   *
   * @return {Number} 音量。範囲は 0 〜 100 となります。
   */
  volume() {
    return this._audioPlayer.volume();
  }

  /**
   * 再生状態を示す値を取得します。
   *
   * @return {PlayState} 再生状態。
   */
  playState() {
    return this._playState;
  }

  /**
   * イベント リスナーを登録します。
   *
   * @param {Function} callback イベント リスナーとなる関数。
   */
  addChangeListener( callback ) {
    this.on( CHANGE_EVENT, callback );
  }

  /**
   * イベント リスナーの登録を解除します。
   *
   * @param {Function} callback イベント リスナーとなっている関数。
   */
  removeChangeListener( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  }

  /**
   * アクションが要求された時に発生します。
   *
   * @param {Object} action アクション情報。
   */
  _onAction( action ) {
    switch( action.actionType ) {
    case ActionTypes.PLAY:
      this._play( action.music );
      break;

    case ActionTypes.PAUSE:
      this._pause();
      break;

    case ActionTypes.STOP:
      this._stop();
      break;

    case ActionTypes.SEEK:
      this._seek( action.playbackTime );
      break;

    case ActionTypes.VOLUME:
      this._volume( action.volume );
      break;

    case ActionTypes.UNSELECT:
      this._unselect();
      break;

    default:
      break;
    }
  }

  /**
   * 更新を通知します。
   */
  _emitChange() {
    this.emit( CHANGE_EVENT );
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
          this._stop();

          let music = MusicListStore.next( this._current );
          if( music ) {
            // 次の曲を再生 ( 更新は play 内で通知される )
            this._play( music );
            return;
          }
        }

        this._emitChange();
      }, 1000 );
    }
  }

  /**
   * 再生を開始します。
   *
   * @param {Music} music 再生対象となる音楽情報。
   */
  _play( music ) {
    if( music ) {
      this._audioPlayer.openFromFile( music.path, ( err ) => {
        if( err ) {
          console.log( err.message );
        } else {
          this._current = music;
          if( this._audioPlayer.play() ) {
            this._playState = PlayState.PLAYING;
            this._emitChange();
            this._playTimer();
          }
        }
      } );

    } else if( this._playState !== PlayState.PLAYING && this._audioPlayer.play() ) {
      this._playState = PlayState.PLAYING;
      this._emitChange();
      this._playTimer();
    }
  }

  /**
   * 再生を一時停止します。
   */
  _pause() {
    if( this._playState === PlayState.PLAYING && this._audioPlayer.pause() ) {
      this._playTimer( true );
      this._playState = PlayState.PAUSED;
      this._emitChange();
    }
  }

  /**
   * 再生を停止します。
   * 状態管理を簡素化するため、この操作は再生状態に関わらず常に強制実行されるようにしています。
   */
  _stop() {
    this._playTimer( true );
    this._playState = PlayState.STOPPED;
    this._audioPlayer.stop();
    this._emitChange();
  }

  /**
   * 再生位置を変更します。
   *
   * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
   *
   * @return {Boolean} 成功時は true。
   */
  _seek( playbackTime ) {
    if( this._audioPlayer.seek( playbackTime ) ) {
      this._emitChange();
    }
  }

  /**
   * 音量を設定します。
   *
   * @param {Number} value 音量。範囲は 0 〜 100 となります。
   */
  _volume( value ) {
    this._audioPlayer.setVolume( value );
    this._emitChange();
  }

  /**
   * 再生対象としている曲の選択状態を解除します。
   */
  _unselect() {
    if( !( this._current ) ) { return; }

    if( this._playState !== PlayState.STOPPED ) {
      this._stop();
    }

    this._current = null;
    this._emitChange();
  }
}

export default new AudioPlayerStore();
