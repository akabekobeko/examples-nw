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
 * @param {String}   filePath 再生対象となるファイルのパス情報。
 * @param {Function} callback コールバック関数。
 */
function play( music, callback ) {
    if( music ) {
        _audioPlayer.openFromFile( music.path, function( err ) {
            if( err ) {
                callback( err );
            } else {
                _current = music;
                _audioPlayer.play();
                callback();
            }
        } );

    } else if( _audioPlayer.playState === PlayState.PAUSED ) {
        _audioPlayer.play();
        callback();
    }
}

/**
 * 再生を一時停止します。
 *
 * @return {Boolean} 成功時は true。
 */
function pause() {
    if( _audioPlayer.playState !== PlayState.PLAYING ) { return false; }

    _audioPlayer.pause();
    return true;
}

/**
 * 再生を停止します。
 *
 * @return {Boolean} 成功時は true。
 */
function pause() {
    if( _audioPlayer.playState === PlayState.STOP ) { return false; }

    _audioPlayer.stop();
    return true;
}

/**
 * 再生位置を変更します。
 *
 * @param {Number} playbackTime 新しい再生位置 ( 秒単位 )。
 *
 * @return {Boolean} 成功時は true。
 */
function seek( playbackTime ) {
    return _audioPlayer.seek( playbackTime );
}

/**
 * アクションを処理します。
 * 
 * @param  {Object} action AudioPlayerConstants に定義されたアクション。
 */
AppDispatcher.register( function( action ) {
    switch( action.actionType ) {
    case ActionTypes.PLAY:
        play( action.music, function( err ) {
            if( err ) {
                console.error( err.message );
            } else {
                AudioPlayerStore.emitChange();
            }
        } );
        break;

    case ActionTypes.PAUSE:
        if( pause() ) {
            AudioPlayerStore.emitChange();
        }
        break;

    case ActionTypes.STOP:
        if( stop() ) {
             AudioPlayerStore.emitChange();
        }
        break;

    case ActionTypes.SEEK:
        if( seek( action.playbackTime ) ) {
            AudioPlayerStore.emitChange();
        }
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