var React = require( 'react' );

/**
 * 音楽プレーヤーの Model - View を仲介するコンポーネントです。
 */
var Player = React.createClass( {
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        return (
            <div className="player">
                <div className="control">
                    <div className="button"><i className="icon-prev"></i></div>
                    <div className="button"><i className="icon-play"></i></div>
                    <div className="button"><i className="icon-next"></i></div>
                    <input className="volume" type="range" onChange={this._onVolumeChange} />
                </div>
                <div className="display">
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

    }
} );

module.exports = Player;