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
                <i className="icon-prev"></i>
                <i className="icon-play"></i>
                <i className="icon-next"></i>
            </div>
        );
    }
} );

module.exports = Player;