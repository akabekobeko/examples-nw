var AppDispatcher        = require( '../dispatcher/AppDispatcher.js' );
var AudioPlayerConstants = require( '../constants/AudioPlayerConstants.js' );
var ActionTypes          = AudioPlayerConstants.ActionTypes;
var PlayState            = AudioPlayerConstants.PlayState;
var EventEmitter         = require( 'events' ).EventEmitter;
var assign               = require( 'object-assign' );

/**
 * イベント種別。
 * @type {String}
 */
var CHANGE_EVENT = 'change';

/**
 * 唯一の音声プレーヤー。
 * @type {AudioPlayer}
 */
var _audioPlayer = new ( require( '../AudioPlayer.js' ) )();

/**
 * 再生対象となる音楽情報。
 * @type {Music}
 */
var _current = null;

/**
 * 音声プレーヤーを操作します。
 * @type {Object}
 */
var AudioPlayerStore = assign( {}, EventEmitter.prototype, {
    /**
     * 再生対象となる音楽情報を取得します。
     *
     * @return {Music} 音楽情報。
     */
    current: function() {
        return _current;
    },

    /**
     * 演奏時間を取得します。
     *
     * @return {Number} 演奏時間 ( 秒単位 )。
     */
    duration: function() {
        return _audioPlayer.duration();
    },

    /**
     * 再生位置を取得します。
     *
     * @return {Number} 再生位置 ( 秒単位 )。
     */
    playbackTime: function() {
        return _audioPlayer.playbackTime();
    },

    /**
     * 音声の周波数スペクトルを取得します。
     *
     * @return {Array} スペクトル。
     */
    spectrums: function() {
        return _audioPlayer.spectrums();
    },

    /**
     * 音量を取得します。
     *
     * @return {Number} 音量。範囲は 0 〜 100 となります。
     */
    volume: function() {
        return _audioPlayer.volume();
    },

    /**
     * 再生状態を示す値を取得します。
     *
     * @return {PlayState} 再生状態。
     */
    playState: function() {
        return _audioPlayer.playState();
    },

    /**
     * 音声が開かれていることを調べます。
     *
     * @return {Boolean} 開かれているなら true。
     */
    isOpened: function() {
        return _audioPlayer.isOpened();
    },

    /**
     * 更新を通知します。
     */
    emitChange: function() {
        this.emit( CHANGE_EVENT );
    },

    /**
     * イベント リスナーを登録します。
     *
     * @param {Function} callback イベント リスナーとなる関数。
     */
    addChangeListener: function( callback ) {
        this.on( CHANGE_EVENT, callback );
    },

    /**
     * イベント リスナーの登録を解除します。
     *
     * @param {Function} callback イベント リスナーとなっている関数。
     */
    removeChangeListener: function( callback ) {
        this.removeListener( CHANGE_EVENT, callback );
    }
} );

/**
 * 再生を開始します。
 *
 * @param {Music} music 再生対象となる音楽情報。
 */
function play( music ) {
    if( music ) {
        _audioPlayer.openFromFile( music.path, function( err ) {
            if( err ) {
                console.log( err.message );
            } else {
                _current = music;
                _audioPlayer.play();
                AudioPlayerStore.emitChange();
            }
        } );

    } else if( _audioPlayer.playState() === PlayState.PAUSED ) {
        _audioPlayer.play();
        AudioPlayerStore.emitChange();
    }
}

/**
 * 再生を一時停止します。
 */
function pause() {
    if( _audioPlayer.playState() === PlayState.PLAYING ) {
        _audioPlayer.pause();
        AudioPlayerStore.emitChange();
    }
}

/**
 * 再生を停止します。
 */
function stop() {
    if( _audioPlayer.playState() !== PlayState.STOP ) { 
        _audioPlayer.stop();
        AudioPlayerStore.emitChange();
    }
}

/**
 * 再生位置を変更します。
 *
 * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
 *
 * @return {Boolean} 成功時は true。
 */
function seek( playbackTime ) {
    if( _audioPlayer.seek( playbackTime ) ) {
        AudioPlayerStore.emitChange();
    }
}

/**
 * アクションを処理します。
 * 
 * @param  {Object} action AudioPlayerConstants に定義されたアクション。
 */
AppDispatcher.register( function( action ) {
    switch( action.actionType ) {
    case ActionTypes.PLAY:
        play( action.music );
        break;

    case ActionTypes.PAUSE:
        pause();
        break;

    case ActionTypes.STOP:
        stop();
        break;

    case ActionTypes.SEEK:
        seek( action.playbackTime );
        break;

    case ActionTypes.PREV:
        break;

    case ActionTypes.NEXT:
        break;

    default:
        break;
    }
} );

module.exports = AudioPlayerStore;