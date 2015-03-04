/**
 * 音楽プレーヤーを表します。
 */
var AudioPlayer = function() {
    /**
     * 音声操作コンテキスト。
     * @type {AudioContext|webkitAudioContext}
     */
    var _audioContext = _createAudioContext();

    /**
     * 音量調整ノード。
     * @type {GainNode}
     */
    var _gainNode = _audioContext.createGain();
    _gainNode.gain.value = 1.0;
    _gainNode.connect( _audioContext.destination );

    /**
     * 音声ソース ノード
     * @type {AudioBufferSourceNode}
     */
    var _sourceNode = null;

    /**
     * 音声バッファ。
     * @type {AudioBuffer}
     */
    var _audioBuffer = null;

    /**
     * 音声再生が実行中であることを示す値。
     * @type {Boolean}
     */
    var _isPlaying = false;

    /**
     * 音声データを再生対象として開きます。
     *
     * @param {ArrayBuffer} buffer   音声データ。
     * @param {Function}    callback 処理が完了したときに呼び出される関数。
     */
    this.open = function( buffer, callback ) {
        this.close();

        _audioContext.createBufferSource( buffer,
            function( audioBuffer ) {
                _audioBuffer = audioBuffer;

                _sourceNode = _audioContext.createBufferSource();
                _sourceNode.buffer  = audioBuffer;
                _sourceNode.onended = _onPlaybackEnd;
                _sourceNode.connect( _gainNode );

                callback();
            },
            function( err ) {
                callback( err );
            }
        );
    };

    /**
     * 再生対象としている音声データを閉じます。
     */
    this.close = function() {
        if( _sourceNode ) {
            _sourceNode.stop( 0 );
            _sourceNode = null;
        }

        _audioBuffer = null;
        _isPlaying   = false;
    };

    /**
     * 音声の再生を開始します。
     */
    this.play = function() {

    };

    /**
     * 音声の再生を一時停止します。
     */
    this.pause = function() {

    };

    /**
     * 音声の再生位置を変更します。
     *
     * @param {Number} portion 再生位置 ( 秒単位 )。
     */
    this.seek = function( portion ) {

    };

    /**
     * 音声再生が終了した時に発生します。
     */
    function _onPlaybackEnd() {

    }

    /**
     * 音声操作コンテキストを生成します。
     *
     * @return {AudioContext} コンテキスト。
     *
     * @throws {Error} Web Audio API が未定義です。
     */
    function _createAudioContext() {
        var audioContext = window.AudioContext || window.webkitAudioContext;
        if( audioContext ) { return new audioContext(); }

        throw new Error( 'Web Audio API is not supported.' );
    }
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
         * 参考 : http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
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
        };

        request.onerror = function( err ) {
            callback( err );
        };
    },
};
