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
 * 再生状態。
 * @type {PlayState}
 */
var _playState = PlayState.STOPPED;

/**
 * 再生時間と演奏終了を監視するためのタイマー。
 * @type {Number}
 */
var _timer = null;

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
        return _playState;
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
 * 再生時間と演奏終了を監視するためのタイマーを開始・停止します。
 *
 * @param {Boolean} isStop タイマーを停止させる場合は true。
 */
function playTimer( isStop ) {
    if( isStop ) {
        clearInterval( _timer );
    } else {
        _timer = setInterval( function() {
            if( _audioPlayer.duration() <= _audioPlayer.playbackTime() ) {
                // 再生終了
                clearInterval( _timer );
                stop();
            } else {
                AudioPlayerStore.emitChange();
            }

        }, 1000 );
    }
}

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
                if( _audioPlayer.play() ) {
                    _playState = PlayState.PLAYING;
                    AudioPlayerStore.emitChange();
                    playTimer();
                }
            }
        } );

    } else if( _playState !== PlayState.PLAYING && _audioPlayer.play() ) {
        _playState = PlayState.PLAYING;
        AudioPlayerStore.emitChange();
        playTimer();
    }
}

/**
 * 再生を一時停止します。
 */
function pause() {
    if( _playState === PlayState.PLAYING && _audioPlayer.pause() ) {
        playTimer( true );
        _playState = PlayState.PAUSED;
        AudioPlayerStore.emitChange();
    }
}

/**
 * 再生を停止します。
 * 状態管理を簡素化するため、この操作は再生状態に関わらず常に強制実行されるようにしています。
 */
function stop() {
    playTimer( true );
    _playState = PlayState.STOPPED; 
    _audioPlayer.stop();
    AudioPlayerStore.emitChange();
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
 * 音量を設定します。
 *
 * @param {Number} value 音量。範囲は 0 〜 100 となります。
 */
function volume( value ) {
    _audioPlayer.setVolume( value );
    AudioPlayerStore.emitChange();
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

    case ActionTypes.VOLUME:
        volume( action.volume );
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