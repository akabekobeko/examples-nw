var React = require( 'react' );

/**
 * 音楽リストの Model - View を仲介するコンポーネントです。
 */
var MusicList = React.createClass( {
    /**
     * コンポーネントの描画オブジェクトを取得します。
     *
     * @return {Object} 描画オブジェクト。
     */
    render: function() {
        var items = this.props.musics.map( function( music, index ) {
            var selected = ( this.props.current && this.props.current.id === music.id ? 'selected' : null );
            return (
                <tr key={music.id} onClick={this._onSelect.bind( this, music )} className={selected}>
                    <td className="number">{index + 1}</td>
                    <td>{music.title}</td>
                    <td>{music.artist}</td>
                    <td>{music.album}</td>
                    <td>{music.duration}</td>
                </tr>
            );

        }, this );

        return (
            <div className="music-list">
                <table className="musics">
                    <thead>
                        <tr><th>#</th><th>Title</th><th>Artis</th><th>Album</th><th>Duration</th></tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        );
    },

    /**
     * 音楽が選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelect: function( music ) {
        if( this.props.onSelect ) {
            this.props.onSelect( music );
        }
    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onPlay: function() {
        if( this.props.onPlay ) {
            this.props.onPlay( music );
        }
    }
} );

module.exports = MusicList;