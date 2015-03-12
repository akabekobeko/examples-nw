var React = require( 'react' );

/**
 * 演奏時間を文字列化します。
 *
 * @param {Number} duration 演奏時間 ( 秒単位 )。
 *
 * @return {String} 文字列化された演奏時間。
 */
function durationToString( duration ) {
    var h = ( duration / 3600 | 0 );
    var m = ( ( duration % 3600 ) / 60 | 0 );
    var s = ( duration % 60 );

    function padding( num ) {
        return ( '0' + num ).slice( -2 );
    }

    return ( 0 < h ? h + ':' + padding( m ) + ':' + padding( s ) :
             0 < m ?                      m + ':' + padding( s ) :
                                             '0:' + padding( s ) );
}

/**
 * 音楽リストの Model - View を仲介するコンポーネントです。
 */
var MusicList = React.createClass( {
    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var items = this.props.musics.map( function( music, index ) {
            var selected = ( this.props.current && this.props.current.id === music.id ? 'selected' : null );
            return (
                <tr key={music.id} onClick={this.onSelectMusic.bind( this, music )} className={selected}>
                    <td className="number">{index + 1}</td>
                    <td>{music.title}</td>
                    <td>{music.artist}</td>
                    <td>{music.album}</td>
                    <td>{durationToString( music.duration )}</td>
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
    onSelectMusic: function( music ) {
        if( this.props.onSelectMusic ) {
            this.props.onSelectMusic( music );
        }
    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    onSelectPlay: function( music ) {
        if( this.props.onSelectPlay ) {
            this.props.onSelectPlay( music );
        }
    }
} );

module.exports = MusicList;