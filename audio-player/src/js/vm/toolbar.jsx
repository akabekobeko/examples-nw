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
                        <input type="range" onChange={this._onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="title">Title</div>
                        </div>
                        <input className="position" type="range" onChange={this._onPositionChange} />
                    </div>
                    <div className="option">
                        <div className="wrapper">
                            <div className="button add"><i className="icon-add"></i></div>
                        </div>
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