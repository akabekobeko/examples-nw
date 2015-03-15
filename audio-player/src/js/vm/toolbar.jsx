var React = require( 'react' );

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
     * 音声プレーヤーを初期化します。
     *
     * @return {AudioPlayer} 音声プレーヤー。
     */
    _initPlayer: function() {
        var AudioPlayer = require( '../model/audio-player.js' );
        var player      = new AudioPlayer();

        player.on( 'start', function( err ) {
            this.setState( { playState: PLAY_STATE_PLAYING } );

        }.bind( this ) );

        player.on( 'pause', function( err ) {
            this.setState( { playState: PLAY_STATE_PAUSED } );
        }.bind( this ) );

        player.on( 'end', function( err ) {
            this.setState( { playState: PLAY_STATE_STOPPED } );

        }.bind( this ) );

        return player;
    },

    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        var FileDialog = require( '../model/file-dialog.js' );
        return {
            playState: PLAY_STATE_STOPPED,
            player: this._initPlayer(),
            openFileDialog: FileDialog.openFileDialog( 'audio/*', true, this._onAddFiles )
        };
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var title = ( this.props.music ? this.props.music.title : '' );
        var play  = ( this.state.playState === PLAY_STATE_PLAYING ? 'pause' : 'play' );
        var playbackTime = '00:00';
        var duration     = '00:00';

        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        {this._renderButton( 'prev' )}
                        {this._renderButton( play )}
                        {this._renderButton( 'next' )}
                        <input type="range" onChange={this.onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="time playtime">{playbackTime}</div>
                            <div className="title">{title}</div>
                            <div className="time duration">{duration}</div>
                        </div>
                        <input className="position" type="range" onChange={this.onPositionChange} />
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
            if( this.state.player.isOpened() ) {
                this.state.player.play();

            } else if( this.props.music ) {
                this.state.player.openFromFile( this.props.music.path, function( err ) {
                    if( err ) {
                        alert( err.message );
                    } else {
                        this.state.player.play();
                    }
                }.bind( this ) );
            }
            break;

        case 'pause':
            this.state.player.pause();
            break;

        case 'prev':
            break;

        case 'next':
            break;

        case 'add':
            this.state.openFileDialog.show();
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
    }
} );

module.exports = Toolbar;