var React              = require( 'react' );
var TextUtil           = require( '../model/util/TextUtility.js' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );

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
                <tr 
                    key={music.id}
                    className={selected}
                    onClick={this._onSelectMusic.bind( this, music )}
                    onDoubleClick={this._onSelectPlay.bind( this, music )}>
                    <td className="number">{index + 1}</td>
                    <td>{music.title}</td>
                    <td>{music.artist}</td>
                    <td>{music.album}</td>
                    <td>{TextUtil.secondsToString( music.duration )}</td>
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
    _onSelectMusic: function( music ) {
        MusicListActions.select( music );
    },

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectPlay: function( music ) {
        AudioPlayerActions.play( music.path );
    }
} );

module.exports = MusicList;