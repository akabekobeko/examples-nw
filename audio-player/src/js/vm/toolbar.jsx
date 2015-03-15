var React    = require( 'react' );
var TextUtil = require( '../model/utility/text-util.js' );

/**
 * 音声プレーヤーが停止していることを示す値。
 * @type {Number}
 */
var PLAY_STATE_STOPPED = 0;

/**
 * 音声プレーヤーが再生中であることを示す値。
 * @type {Number}
 */
var PLAY_STATE_PLAYING = 1;

/**
 * 音声プレーヤーが一時停止していることを示す値。
 * @type {Number}
 */
var PLAY_STATE_PAUSED  = 2;

/**
 * ツールバー用コンポーネントです。
 */
var Toolbar = React.createClass( {
    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        var AudioPlayer = require( '../model/audio-player.js' );
        this._player    = new AudioPlayer();

        this._player.on( 'start', function( err ) {
            this.setState( { playState: PLAY_STATE_PLAYING } );

        }.bind( this ) );

        this._player.on( 'pause', function( err ) {
            this.setState( { playState: PLAY_STATE_PAUSED } );
        }.bind( this ) );

        this._player.on( 'end', function( err ) {
            this.setState( { playState: PLAY_STATE_STOPPED } );

        }.bind( this ) );

        var FileDialog = require( '../model/file-dialog.js' );
        this._openFileDialog = FileDialog.openFileDialog( 'audio/*', true, this._onAddFiles );
    },

    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            playState: PLAY_STATE_STOPPED,
            playtime: 0,
            volume: 100,
        };
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var metadata = this._metadata();
        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        {this._renderButton( 'prev' )}
                        {this._renderButton( metadata.playIcon )}
                        {this._renderButton( 'next' )}
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={this.state.volume}
                            onChange={this._onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="time playtime">{metadata.playtime}</div>
                            <div className="title">{metadata.title}</div>
                            <div className="time duration">{metadata.duration}</div>
                        </div>
                        <input
                            className="position"
                            type="range"
                            min={0}
                            max={metadata.positionMax}
                            onChange={this._onPositionChange} />
                    </div>
                    <div className="option">
                        <div className="wrapper">
                            {this._renderButton( 'add' )}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * 表示用メタデータを生成します。
     *
     * @return {Object} メタデータ。
     */
    _metadata: function() {
        var playIcon = ( this.state.playState === PLAY_STATE_PLAYING ? 'pause' : 'play' );
        var playtime = TextUtil.secondsToString( this.state.playtime );

        return this.props.music ?
            {
                playIcon:    playIcon,
                playtime:    playtime,
                title:       this.props.music.title,
                positionMax: this.props.music.duration,
                duration:    TextUtil.secondsToString( this.props.music.duration )
            } :
            {
                playIcon:    playIcon,
                playtime:    playtime,
                title:       '--',
                positionMax: 0,
                duration:    '00:00'
            };
    },

    /**
     * ボタンを描画します。
     *
     * @param {String} type ボタン種別。
     *
     * @return {Object} React エレメント。
     */
    _renderButton: function( type ) {
        return (
            <div className="button" onClick={this._onPressButton.bind( this, type )}>
                <i className={'icon-' + type}></i>
            </div>
        );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            if( this._player.isOpened() ) {
                this._player.play();

            } else if( this.props.music ) {
                this._player.openFromFile( this.props.music.path, function( err ) {
                    if( err ) {
                        alert( err.message );
                    } else {
                        this._player.play();
                    }
                }.bind( this ) );
            }
            break;

        case 'pause':
            this._player.pause();
            break;

        case 'prev':
            break;

        case 'next':
            break;

        case 'add':
            this._openFileDialog.show();
            break;
        }
    },

    /**
     * ファイルが追加される時に発生します。
     *
     * @param  {FileList} files ファイル情報コレクション。
     */
    _onAddFiles: function( files ) {
        if( this.props.onAddFiles ) {
            this.props.onAddFiles( files );
        }
    },

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange: function( ev ) {
        this._player.setVolume( ev.target.value );
        this.setState( { volume: ev.target.value } );
    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange: function( ev ) {

    }
} );

module.exports = Toolbar;