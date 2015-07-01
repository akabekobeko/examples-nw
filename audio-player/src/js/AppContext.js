import { Context }       from 'material-flux';
import MusicListAction   from './actions/MusicListAction.js';
import MusicListStore    from './stores/MusicListStore.js';
import AudioPlayerAction from './actions/AudioPlayerAction.js';
import AudioPlayerStore  from './stores/AudioPlayerStore.js';

/**
 * アプリケーションを表します。
 */
export default class AppContext extends Context {
  /**
   * インスタンスを初期化します。
   */
  constructor() {
    super();

    /**
     * 音楽情報の操作。
     * @type {MusicListAction}
     */
    this.musicListAction = new MusicListAction( this );

    /**
     * 音楽情報の管理。
     * @type {MusicListStore}
     */
    this.musicListStore  = new MusicListStore( this );

    /**
     * 音声操作
     * @type {AudioPlayerAction}
     */
    this.audioPlayerAction = new AudioPlayerAction( this );

    /**
     * 音声データ管理。
     * @type {AudioPlayerStore}
     */
    this.audioPlayerStore  = new AudioPlayerStore( this, this.musicListStore );
  }
}
