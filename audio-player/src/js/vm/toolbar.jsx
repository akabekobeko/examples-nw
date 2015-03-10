var React = require( 'react' );

/**
 * ツールバー用コンポーネントです。
 */
var Toolbar = React.createClass( {
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        <div className="button"><i className="icon-prev"></i></div>
                        <div className="button"><i className="icon-play"></i></div>
                        <div className="button"><i className="icon-next"></i></div>
                        <input className="volume" type="range" onChange={this._onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="title">Title</div>
                        </div>
                        <div className="time">
                            <span className="playtime">00:00:00</span>
                            <div className="position-wrapper">
                                <input className="position" type="range" onChange={this._onPositionChange} />
                            </div>
                            <span className="duration">00:00:00</span>
                        </div>
                    </div>
                    <div className="option">

                    </div>
                </div>
            </div>
        );
    },

    /**
     * 音声ボリュームが変更された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    _onVolumeChange: function( ev ) {

    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    _onPositionChange: function( ev ) {

    }
} );

module.exports = Toolbar;