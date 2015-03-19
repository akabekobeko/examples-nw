var React              = require( 'react' );
var TextUtil           = require( '../model/util/TextUtility.js' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );

/**
 * ツールバー用コンポーネントです。
 */
var Toolbar = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            playState: PlayState.STOPPED,
            playtime:  0,
            volume:    100,
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
                            value={this.state.playtime}
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
        var playIcon = ( this.state.playState === PlayState.PLAYING ? 'pause' : 'play' );
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
            AudioPlayerActions.play();
            break;

        case 'pause':
            AudioPlayerActions.pause();
            break;

        case 'prev':
            break;

        case 'next':
            break;

        case 'add':
            MusicListActions.add();
            break;
        }
    },

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange: function( ev ) {
        AudioPlayerActions.volume( ev.target.value );
    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange: function( ev ) {
        AudioPlayerActions.seek( ev.target.value );
    }
} );

module.exports = Toolbar;