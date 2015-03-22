var React              = require( 'react' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var AudioPlayerActions = require( '../model/actions/AudioPlayerActions.js' );
var MusicListView      = require('../view/MusicListView.jsx');

/**
 * 音楽リストの Model - View を仲介するコンポーネントです。
 *
 * @type {ReactClass}
 */
var MusicListViewModel = React.createClass( {
    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return MusicListView( this );
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
        AudioPlayerActions.play( music );
    }
} );

module.exports = MusicListViewModel;