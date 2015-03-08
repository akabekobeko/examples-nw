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
    this._audioContext = this._createAudioContext();

    /**
     * 音量調整ノード。
     * @type {GainNode}
     */
    this._gainNode = this._audioContext.createGain();
    this._gainNode.gain.value = 1.0;
    this._gainNode.connect( this._audioContext.destination );

    /**
     * アナライザー ノード。
     * @type {AnalyserNode}
     */
    this._analyserNode = this._audioContext.createAnalyser();
    this._analyserNode.fftSize = 128;
    this._analyserNode.connect( this._gainNode );

    /**
     * 音声ソース ノード。
     * @type {AudioBufferSourceNode}
     */
    this._sourceNode = null;

    /**
     * 音声バッファ。
     * @type {AudioBuffer}
     */
    this._audioBuffer = null;

    /**
     * 音声再生が実行中であることを示す値。
     * @type {Boolean}
     */
    this._isPlaying = false;

    /**
     * 再生位置 ( 秒単位 )。
     * @type {Number}
     */
    this._playbackTime = 0; // time of the audio playback, seconds

    /**
     * 再生を開始した時の日時 ( ミリ秒単位 )。
     * AudioBufferSourceNode の再生操作は start/stop のみをサポートし、pause が存在しません。
     * よって、これを実装するために start 時間を記録し、pause された時の現時刻から引いて再開位置を算出します。
     *
     * @type {Number}
     */
    this._startTimestamp = 0;

    /**
     * 音声データを再生対象として開きます。
     *
     * @param {ArrayBuffer} buffer   音声データ。
     * @param {Function}    callback 処理が完了したときに呼び出される関数。
     */
    this.open = function( buffer, callback ) {
        this._audioContext.createBufferSource(
            buffer,

            function( audioBuffer ) {
                this.close();

                this._audioBuffer = audioBuffer;
                this._initSourceNode();

                callback();
            }.bind( this ),

            function( err ) {
                callback( err );
            }
        );
    };

    /**
     * 再生対象としている音声データを閉じます。
     */
    this.close = function() {
        this._stop();

        this._audioBuffer    = null;
        this._playbackTime   = 0;
        this._startTimestamp = 0;
    };

    /**
     * 音声の再生を開始します。
     */
    this.play = function() {
        if( this._isPlaying ) { return; }

        this._initSourceNode();
        this._source.start( 0, this._playbackTime );

        this._startTimestamp = Date.now();
        this._isPlaying      = true;
    };

    /**
     * 音声の再生を一時停止します。
     */
    this.pause = function() {
        this._stop( true );
    };

    /**
     * 音声の再生位置を変更します。
     *
     * @param {Number} playbackTime 再生位置 ( 秒単位 )。
     */
    this.seek = function( playbackTime ) {
        if( playbackTime === undefined ) { return; }

        if( playbackTime > this._buffer.duration ) {
            console.log( '[ERROR] Seek time is greater than duration of audio buffer.' );
            return;
        }

        if( this._isPlaying ) {
            this.stop();
            this._playbackTime = playbackTime;
            this.play();
        } else {
            this._playbackTime = playbackTime;
        }
    };

    /**
     * 音声の周波数スペクトルを取得します。
     *
     * @return {Array} スペクトル。
     */
    this.spectrums = function() {
        var spectrums = new Uint8Array( this._analyserNode.frequencyBinCount );
        this._analyserNode.getByteFrequencyData( spectrums );

        return spectrums;
    };

    /**
     * 音声の再生を停止します。
     */
    this._stop = function( pause ) {
        if( !( this._isPlaying ) ) { return; }
        this._isPlaying = false;

        if( this._sourceNode ) {
            this._sourceNode.stop();
            this._sourceNode = null;
        }

        // 一時停止なら次回の再生時に復元するための位置を記録
        this._playbackTime =( pause ? ( Date.now() - this._startTimestamp ) / 1000 + this._playbackTime : 0 );
    };

    /**
     * 音声再生が終了した時に発生します。
     */
    this._onEnded = function() {
        if( this._isPlaying ) {
            this._playbackTime = 0;
        }

        this._isPlaying = false;
    };

    /**
     * 音声ソース ノードを初期化します。
     */
    this._initSourceNode = function() {
        this._sourceNode = this._audioContext.createBufferSource();
        this._sourceNode.buffer  = this._audioBuffer;
        this._sourceNode.onended = this._onPlaybackEnd;
        this._sourceNode.connect( this._analyserNode );

        var onEnded = this._onEnded.bind( this );
        this._sourceNode.onended = onEnded;
    };

    /**
     * 音声操作コンテキストを生成します。
     *
     * @return {AudioContext} コンテキスト。
     *
     * @throws {Error} Web Audio API が未定義です。
     */
    this._createAudioContext = function() {
        var audioContext = ( window.AudioContext || window.webkitAudioContext );
        if( audioContext ) { return new audioContext(); }

        throw new Error( 'Web Audio API is not supported.' );
    };
};

/**
 * 音楽プレーヤーを生成します。
 * @type {Object}
 */
module.exports = {
    /**
     * 音声データから音楽プレーヤーを生成します。
     *
     * @param  {ArrayBuffer}   buffer   音声データ。
     * @param  {Function}      callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    fromArrayBuffer: function( buffer, callback ) {
        if( !( buffer && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        try {
            var player = new AudioPlayer();
            player.open( buffer, function( err ) {
                if( err ) {
                    callback( err );
                } else {
                    callback( null, player );
                }
            } );

        } catch( exp ) {
            callback( exp );
        }
    },

    /**
     * 音楽ファイルのパス情報から音楽プレーヤーを生成します。
     *
     * @param  {String}   filePath 音楽ファイルのパス情報。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    fromFile: function( filePath, callback ) {
        if( !( filePath && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        /**
         * Node.js の Buffer を JavaScript の ArrayBuffer に変換します。
         * 
         * @see referred: http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
         *
         * @param  {Buffer} Node.js の Buffer。
         *
         * @return {ArrayBuffer} JavaScript の ArrayBuffer。
         */
        function toArrayBuffer( buffer ) {
            var ab   = new ArrayBuffer( buffer.length );
            var view = new Uint8Array( ab );

            for( var i = 0, max = buffer.length; i < max; ++i ) {
                view[ i ] = buffer[ i ];
            }

            return ab;
        }

        var fs = require( 'fs' );
        fs.readFile( filePath, function( err, data ) {
            if( err ) {
                callback( err );

            } else {
                this.fromArrayBuffer( toArrayBuffer( data ) );
            }
        }.bind( this ) );
    },

    /**
     * 音声データの URL から音楽プレーヤーを生成します。
     *
     * @param  {String}   url      音声データの URL。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    fromURL: function( url, callback ) {
        if( !( url && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        var request = new XMLHttpRequest();
        request.open( 'GET', url );
        request.responseType = 'arraybuffer'; 

        request.onload = function() {
            this.fromArrayBuffer( request.response, callback );
        }.bind( this );

        request.onerror = function( err ) {
            callback( err );
        };
    },
};
