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

    this.musicListAction = new MusicListAction( this );
    this.musicListStore  = new MusicListStore( this );

    this.audioPlayerAction = new AudioPlayerAction( this );
    this.audioPlayerStore  = new AudioPlayerStore( this, this.musicListStore );
  }
}
