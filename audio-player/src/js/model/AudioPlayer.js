/**
 * 音声プレーヤーを提供します。
 *
 * @see referred: http://github.com/eipark/buffaudio
 *
 * @throws {Error} Web Audio API が未定義です。
 */
export default class AudioPlayer {
    /**
     * インスタンスを初期化します。
     */
    constructor() {
        /**
         * 音声操作コンテキスト。
         * @type {AudioContext|webkitAudioContext}
         */
        this._audioContext = ( () => {
            var audioContext = ( window.AudioContext || window.webkitAudioContext );
            if( audioContext ) { return new audioContext(); }

            throw new Error( 'Web Audio API is not supported.' );
        } )();

        /**
         * 音量調整ノード。
         * @type {GainNode}
         */
        this._gainNode = this._audioContext.createGain();
        this._gainNode.gain.value = 1.0;
        this._gainNode.connect( this._audioContext.destination );

        /**
         * 音声解析ノード。
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
         * 音声が再生中であることを示す値。
         * @type {Boolean}
         */
        this._isPlaying = false;

        /**
         * 再生位置 ( 秒単位 )。
         * @type {Number}
         */
        this._playbackTime = 0;

        /**
         * 再生を開始した時の日時 ( ミリ秒単位 )。
         * AudioBufferSourceNode の再生操作は start/stop のみをサポートし、pause が存在しません。
         * よって、これを実装するために start 時間を記録し、pause された時の現時刻から引いて再開位置を算出します。
         *
         * @type {Number}
         */
        this._startTimestamp = 0;
    }

    /**
     * 音声データを再生対象として開きます。
     *
     * @param {ArrayBuffer} buffer   音声データ。
     * @param {Function}    callback 処理が完了したときに呼び出される関数。
     */
    open( buffer, callback ) {
        this._audioContext.decodeAudioData( buffer,
            ( audioBuffer ) => {
                this.close();

                this._audioBuffer = audioBuffer;
                this._initSourceNode();

                callback();

            }.bind( this ),

            () => {
                // webkitAudioContext だとエラーが取れないので自前指定
                callback( new Error( 'Faild to decode for audio data.' ) );
            }
        );
    }

    /**
     * 音楽ファイルのパス情報から音楽プレーヤーを生成します。
     *
     * @param  {String}   filePath 音楽ファイルのパス情報。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    openFromFile( filePath, callback ) {
        if( !( filePath && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        var fs = window.require( 'fs' );
        fs.readFile( filePath, ( err, data ) => {
            if( err ) {
                callback( err );

            } else {
                this.open( this._toArrayBuffer( data ), callback );
            }
        }.bind( this ) );
    }

    /**
     * 音声データの URL から音楽プレーヤーを生成します。
     *
     * @param  {String}   url      音声データの URL。
     * @param  {Function} callback 処理が完了したときに呼び出される関数。
     *
     * @throws {Error} filePath または callback が未定義です。
     */
    openFromURL( url, callback ) {
        if( !( url && callback ) ) { throw new Error( 'Arguments is not defined.' ); }

        var request = new XMLHttpRequest();
        request.open( 'GET', url );
        request.responseType = 'arraybuffer'; 

        request.onload = () => {
            this.open( request.response, callback );
        }.bind( this );

        request.onerror = ( err ) => {
            callback( err );
        };
    }

    /**
     * 再生対象としている音声データを閉じます。
     */
    close() {
        this.stop();

        this._audioBuffer    = null;
        this._playbackTime   = 0;
        this._startTimestamp = 0;
    }

    /**
     * 音声の再生を開始します。
     *
     * @return {Boolean} 成功時は true。
     */
    play() {
        console.log( '[play]' );
        if( this._isPlaying ) { return false; }

        this._initSourceNode();
        this._sourceNode.start( 0, this._playbackTime );
        this._startTimestamp = Date.now();
        this._isPlaying      = true;

        return true;
    }

    /**
     * 音声の再生を一時停止します。
     *
     * @return {Boolean} 成功時は true。
     */
    pause() {
        console.log( '[pause]' );
        if( !( this._isPlaying ) ) { return false; }

        this.stop( true );
        return true;
    }

    /**
     * 音声の再生を停止します。
     *
     * @param {Boolean}
     */
    stop( pause ) {
        console.log( '[stop]' );
        if( pause ) {
            // 一時停止呼ならば onended を無効化しておく
            // この処理がないと play の後に onended が遅延実行され、再生状態がおかしくなる
            // 
            if( this._sourceNode ) {
                this._sourceNode.onended = null;
                this._sourceNode.stop();
                this._sourceNode = null;
            }

            // 次回の再生時に復元するための位置を記録
            this._playbackTime = this.playbackTime();

        } else {
            if( this._sourceNode ) {
                this._sourceNode.stop();
                this._sourceNode = null;
            }

            this._playbackTime = 0;
        }

        // this.playbackTime() 内で現在位置を算出してからフラグを無効化する
        this._isPlaying = false;
    }

    /**
     * 音声の再生位置を変更します。
     *
     * @param {Number} playbackTime 再生位置 ( 秒単位 )。
     *
     * @return {Boolean} 成功時は true。
     */
    seek( playbackTime ) {
        console.log( '[seek]' );
        if( playbackTime === undefined ) { return false; }

        // 時間指定が文字列になる現象を避けるため、ここで強制的に数値化しておく
        playbackTime = Number( playbackTime );
        if( this.duration() < playbackTime ) {
            console.log( '[ERROR] Seek time is greater than duration of audio buffer.' );
            return false;
        }

        if( this._isPlaying ) {
            this.pause();
            this._playbackTime = playbackTime;
            this.play();
        } else {
            this._playbackTime = playbackTime;
        }

        return true;
    }

    /**
     * 演奏時間を取得します。
     *
     * @return {Number} 演奏時間 ( 秒単位 )。
     */
    duration() {
        return ( this._audioBuffer ? Math.round( this._audioBuffer.duration ) : 0 );
    }

    /**
     * 再生位置を取得します。
     *
     * @return {Number} 再生位置 ( 秒単位 )。
     */
    playbackTime() {
        if( this._isPlaying ) {
            return ( Math.round( ( Date.now() - this._startTimestamp ) / 1000 ) + this._playbackTime );
        } else {
            return this._playbackTime;
        }
    }

    /**
     * 音声の周波数スペクトルを取得します。
     *
     * @return {Array} スペクトル。
     */
    spectrums() {
        var spectrums = new Uint8Array( this._analyserNode.frequencyBinCount );
        this._analyserNode.getByteFrequencyData( spectrums );

        return spectrums;
    }

    /**
     * 音量を取得します。
     *
     * @return {Number} 音量。範囲は 0 〜 100 となります。
     */
    volume() {
        return ( this._gainNode.gain.value * 100 );
    }

    /**
     * 音量を設定します。
     *
     * @param {Number} value 音量。範囲は 0 〜 100 となります。
     */
    setVolume( value ) {
        if( 0 <= value && value <= 100 ) {
            this._gainNode.gain.value = ( value / 100 );
        }
    };

    /**
     * 音声再生が終了した時に発生します。
     */
    _onEnded() {
        console.log( '[onend]' );
    }

    /**
     * 音声ソース ノードを初期化します。
     */
    _initSourceNode() {
        this._sourceNode = this._audioContext.createBufferSource();
        this._sourceNode.buffer  = this._audioBuffer;
        this._sourceNode.connect( this._analyserNode );

        var onEnded = this._onEnded.bind( this );
        this._sourceNode.onended = onEnded;
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
    _toArrayBuffer( buffer ) {
        var ab   = new ArrayBuffer( buffer.length );
        var view = new Uint8Array( ab );

        for( var i = 0, max = buffer.length; i < max; ++i ) {
            view[ i ] = buffer[ i ];
        }

        return ab;
    }
}
