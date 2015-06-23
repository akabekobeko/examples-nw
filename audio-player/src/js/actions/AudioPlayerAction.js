import { Action } from 'material-flux';

/**
 * 音声プレーヤーの操作種別を定義します。
 * @type {Object}
 */
export const Keys = {
  play:     Symbol( 'AudioPlayerAction.play' ),
  pause:    Symbol( 'AudioPlayerAction.pause' ),
  stop:     Symbol( 'AudioPlayerAction.stop' ),
  seek:     Symbol( 'AudioPlayerAction.seek' ),
  volume:   Symbol( 'AudioPlayerAction.volume' ),
  unselect: Symbol( 'AudioPlayerAction.unselect' )
};

/**
 * 音声プレーヤーを操作します。
 */
export default class AudioPlayerAction extends Action {
  /**
   * 音声を再生します。
   *
   * @param {Music} music 再生対象とする音楽情報。
   */
  play( music ) {
    this.dispatch( Keys.play, music );
  }

  /**
   * 音声再生を一時停止します。
   */
  pause() {
    this.dispatch( Keys.pause );
  }

  /**
   * 音声再生を停止します。
   */
  stop() {
    this.dispatch( Keys.stop );
  }

  /**
   * 再生位置を変更します。
   *
   * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
   */
  seek( playbackTime ) {
    this.dispatch( Keys.seek, playbackTime );
  }

  /**
   * 音量を変更します。
   *
   * @param {Number} volume 新しい音量 ( 0 〜 100 )。
   */
  volume( volume ) {
    this.dispatch( Keys.volume, volume );
  }

  /**
   * 再生対象としている曲の選択を解除します。
   */
  unselect() {
    this.dispatch( Keys.unselect );
  }
}
