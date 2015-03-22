var React              = require( 'react' );
var MusicListActions   = require( '../model/actions/MusicListActions.js' );
var MusicStore         = require( '../model/stores/MusicListStore.js' );
var PlayState          = require( '../model/constants/AudioPlayerConstants.js' ).PlayState;
var MainView           = require( '../view/MainView.jsx' );
var ToolbarViewModel   = require( './ToolbarViewModel.js' );
var MusicListViewModel = require( './MusicListViewModel.js' );

/**
 * アプリケーションのエントリー ポイントになるコンポーネントです。
 *
 * @type {ReactClass}
 */
var MainViewModel = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        return {
            musics:  [],
            current: null
        };
    },

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount: function() {
        MusicStore.addChangeListener( this._onMusicListChange );
        MusicListActions.init();
    },

    /**
     * コンポーネント配置が解除される時に発生します。
     */
    componentWillUnmount: function() {
        MusicStore.removeChangeListener( this._onMusicListChange );
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return MainView( this, ToolbarViewModel, MusicListViewModel );
    },

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange: function() {
        this.setState( {
            musics:  MusicStore.getAll(),
            current: MusicStore.current()
        } );
    }
} );

/**
 * コンポーネント処理を開始します。
 *
 * @param {Object} query コンポーネントの配置対象となる DOM を示すクエリ。
 *
 * @return {Object} コンポーネント。
 */
module.exports = function( query ) {
    return React.render(
        <MainViewModel />,
        document.querySelector( query )
    );
};
