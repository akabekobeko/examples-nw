var PlayState = require( './constants/AudioPlayerConstants.js' ).PlayState;

/**
 * 音声プレーヤーを提供します。
 *
 * @see referred: http://github.com/eipark/buffaudio
 *
 * @throws {Error} Web Audio API が未定義です。
 */
var AudioPlayer = function() {
    /**
     * 音声操作コンテキスト。
     * @type {AudioContext|webkitAudioContext}
     */
    var _audioContext = ( function() {
        var audioContext = ( window.AudioContext || window.webkitAudioContext );
        if( audioContext ) { return new audioContext(); }

        throw new Error( 'Web Audio API is not supported.' );
    } )();

    /**
     * 音量調整ノード。
     * @type {GainNode}
     */
    var _gainNode = _audioContext.createGain();
    _gainNode.gain.value = 1.0;
    _gainNode.connect( _audioContext.destination );

    /**
     * 音声解析ノード。
     * @type {AnalyserNode}
     */
    var _analyserNode = _audioContext.createAnalyser();
    _analyserNode.fftSize = 128;
    _analyserNode.connect( _gainNode );

    /**
     * 音声ソース ノード。
     * @type {AudioBufferSourceNode}
     */
    var _sourceNode = null;

    /**
     * 音声バッファ。
     * @type {AudioBuffer}
     */
    var _audioBuffer = null;

    /**
     * 音声が開かれたことを示す値。
     * @type {Boolean}
     */
    var _isOpened = false;

    /**
     * 音声状態を示す値。
     * @type {PlayState}
     */
    var _playState = PlayState.STOPPED;

    /**
     * イベント ハンドラ。
     * @type {Object}
     */
    var _events = {
        open: null,
        start: null,
        pause: null,
        end: null
    };

    /**
     * 再生位置 ( 秒単位 )。
     * @type {Number}
     */
    var _playbackTime = 0;

    /**
     * 再生を開始した時の日時 ( ミリ秒単位 )。
     * AudioBufferSourceNode の再生操作は start/stop のみをサポートし、pause が存在しません。
     * よって、これを実装するために start 時間を記録し、pause された時の現時刻から引いて再開位置を算出します。
     *
     * @type {Number}
     */
    var _startTimestamp = 0;

    /**
     * 音声データを再生対象として開きます。
     *
     * @param {ArrayBuffer} buffer   音声データ。
     * @param {Function}    callback 処理が完了したときに呼び出される関数。
     */
    this.open = function( buffer, callback ) {
        _audioContext.decodeAudioData( buffer,
            function( audioBuffer ) {
                this.close();

                _audioBuffer = audioBuffer;
                _initSourceNode();

                _isOpened = true;
                callback();

            }.bind( this ),

            function() {
                // webkitAudioContext だとエラーが取れないので自前指定
                callback( new Error( 'Faild to decode for audio data.' ) );
            }
        );
    };

    /**
     * 音楽ファイルのパス情報から音楽プレーヤーを生成します。
     *
     * @param  {String}   filePath 音楽ファイルのパス情報。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    this.openFromFile = function( filePath, callback ) {
        if( !( filePath && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        var fs = window.require( 'fs' );
        fs.readFile( filePath, function( err, data ) {
            if( err ) {
                callback( err );

            } else {
                this.open( _toArrayBuffer( data ), callback );
            }
        }.bind( this ) );
    };

    /**
     * 音声データの URL から音楽プレーヤーを生成します。
     *
     * @param  {String}   url      音声データの URL。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    this.openFromURL = function( url, callback ) {
        if( !( url && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        var request = new XMLHttpRequest();
        request.open( 'GET', url );
        request.responseType = 'arraybuffer'; 

        request.onload = function() {
            this.open( request.response, callback );
        }.bind( this );

        request.onerror = function( err ) {
            callback( err );
        };
    };

    /**
     * 再生対象としている音声データを閉じます。
     */
    this.close = function() {
        this.stop();

        _audioBuffer    = null;
        _playbackTime   = 0;
        _startTimestamp = 0;
    };

    /**
     * 音声の再生を開始します。
     */
    this.play = function() {
        console.log( '[play]' );
        if( _playState === PlayState.PLAYING ) { return; }

        _initSourceNode();
        _sourceNode.start( 0, _playbackTime );

        _startTimestamp = Date.now();
        _playState      = PlayState.PLAYING;

        if( _events.start ) {
            _events.start();
        }
    };

    /**
     * 音声の再生を一時停止します。
     */
    this.pause = function() {
        console.log( '[pause]' );
        if( _playState === PlayState.PLAYING ) {
            this.stop( true );
        }
    };

    /**
     * 音声の再生を停止します。
     */
    this.stop = function( pause ) {
        console.log( '[stop]' );
        if( _playState === PlayState.STOPPED ) { return; }

        if( _sourceNode ) {
            // seek から呼ばれたなら、すぐに play されるので onended を無効化する
            // この処理がないと play の後に onended が遅延実行され、再生状態がおかしくなる
            //  
            if( _playState === PlayState.SEEKING ) {
                _sourceNode.onended = null;
            }

            _sourceNode.stop();
            _sourceNode = null;
        }

        // 一時停止なら次回の再生時に復元するための位置を記録
        _playbackTime = ( pause ? this.playbackTime() : 0 );

        if( pause ) {
            _playState = PlayState.PAUSED;
            if( _events.pause ) {
                _events.pause();
            }

        } else {
            _playState = PlayState.STOPPED;
        }
    };

    /**
     * 音声の再生位置を変更します。
     *
     * @param {Number} playbackTime 再生位置 ( 秒単位 )。
     *
     * @return {Boolean} 成功時は true。
     */
    this.seek = function( playbackTime ) {
        console.log( '[seek]' );
        if( playbackTime === undefined ) { return false; }

        if( playbackTime > _audioBuffer.duration ) {
            console.log( '[ERROR] Seek time is greater than duration of audio buffer.' );
            return false;
        }

        if( _playState === PlayState.PLAYING ) {
            _playState = PlayState.SEEKING;
            this.stop();

            _playbackTime = playbackTime;
            this.play();
        } else {
            _playbackTime = playbackTime;
        }

        return true;
    };

    /**
     * 演奏時間を取得します。
     *
     * @return {Number} 演奏時間 ( 秒単位 )。
     */
    this.duration = function() {
        return ( _audioBuffer ? _audioBuffer.duration : 0 );
    };

    /**
     * 再生位置を取得します。
     *
     * @return {Number} 再生位置 ( 秒単位 )。
     */
    this.playbackTime = function() {
        return ( ( ( Date.now() - _startTimestamp ) / 1000 ) + _playbackTime );
    };

    /**
     * 音声の周波数スペクトルを取得します。
     *
     * @return {Array} スペクトル。
     */
    this.spectrums = function() {
        var spectrums = new Uint8Array( _analyserNode.frequencyBinCount );
        _analyserNode.getByteFrequencyData( spectrums );

        return spectrums;
    };

    /**
     * 音量を取得します。
     *
     * @return {Number} 音量。範囲は 0 〜 100 となります。
     */
    this.volume = function() {
        return ( _gainNode.gain.value * 100 );
    };

    /**
     * 音量を設定します。
     *
     * @param {Number} value 音量。範囲は 0 〜 100 となります。
     */
    this.setVolume = function( value ) {
        if( 0 <= value && value <= 100 ) {
            _gainNode.gain.value = ( value / 100 );
        }
    };

    /**
     * 再生状態を示す値を取得します。
     *
     * @return {PlayState} 再生状態。
     */
    this.playState = function() {
        return _playState;
    };

    /**
     * 音声が開かれていることを調べます。
     *
     * @return {Boolean} 開かれているなら true。
     */
    this.isOpened = function() {
        return _isOpened;
    };

    /**
     * イベント ハンドラを設定します。
     *
     * @param  {String}   event    イベント名。
     * @param  {Function} callback コールバック関数。
     *
     * @return {Boolean} 成功時は true。
     */
    this.on = function( event, callback ) {
        switch( event ) {
        case 'open':
            _events.open = callback;
            break;

        case 'start':
            _events.start = callback;
            break;

        case 'pause':
            _events.pause = callback;
            break;

        case 'end':
            _events.end = callback;
            break;

        default:
            return false;
        }

        return true;
    };

    /**
     * 音声再生が終了した時に発生します。
     */
    function _onEnded() {
        console.log( '[onend]' );
        _playbackTime = 0;
        _playState    = PlayState.STOPPED;

        if( _events.end ) {
            _events.end();
        }
    }

    /**
     * 音声ソース ノードを初期化します。
     */
    function _initSourceNode() {
        _sourceNode = _audioContext.createBufferSource();
        _sourceNode.buffer  = _audioBuffer;
        _sourceNode.connect( _analyserNode );

        var onEnded = _onEnded.bind( this );
        _sourceNode.onended = onEnded;
    }

    /**
     * Node.js の Buffer を JavaScript の ArrayBuffer に変換します。
     * 
     * @see referred: http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
     *
     * @param  {Buffer} Node.js の Buffer。
     *
     * @return {ArrayBuffer} JavaScript の ArrayBuffer。
     */
    function _toArrayBuffer( buffer ) {
        var ab   = new ArrayBuffer( buffer.length );
        var view = new Uint8Array( ab );

        for( var i = 0, max = buffer.length; i < max; ++i ) {
            view[ i ] = buffer[ i ];
        }

        return ab;
    }
};

/**
 * 音楽プレーヤーを生成します。
 * @type {Object}
 */
module.exports = AudioPlayer;