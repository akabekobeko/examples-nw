import React              from 'react';
import AudioPlayerStore   from '../model/stores/AudioPlayerStore.js';
import MusicListActions   from '../model/actions/MusicListActions.js';
import MusicListStore     from '../model/stores/MusicListStore.js';
import {PlayState}        from '../model/constants/AudioPlayerConstants.js';
import MainView           from '../view/MainView.jsx';
import ToolbarViewModel   from './ToolbarViewModel.js';
import MusicListViewModel from './MusicListViewModel.js';
import Util               from '../model/util/Utility.js';

/**
 * アプリケーションのエントリー ポイントになるコンポーネントです。
 *
 * @type {ReactClass}
 */
class MainViewModel extends React.Component {
    /**
     * コンポーネントを初期化します。
     *
     * @param {Object} props プロパティ。
     */
    constructor( props ) {
        super( props );
        this.state = {
            musics:       [],
            current:      null,
            currentPlay:  null,
            playState:    PlayState.STOPPED,
            duration:     0,
            playbackTime: 0,
            volume:       100
        };
    }

    /**
     * コンポーネントが配置される時に発生します。
     */
    componentDidMount() {
        AudioPlayerStore.addChangeListener( this._onAudioPlayerChange.bind( this ) );
        MusicListStore.addChangeListener( this._onMusicListChange.bind( this ) );
        MusicListActions.init();
    }

    /**
     * コンポーネント配置が解除される時に発生します。
     */
    componentWillUnmount() {
        AudioPlayerStore.removeChangeListener( this._onAudioPlayerChange.bind( this ) );
        MusicListStore.removeChangeListener( this._onMusicListChange.bind( this ) );
    }

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render() {
        return MainView( Util.mixin( this.state, {
            ToolbarViewModel:   ToolbarViewModel,
            MusicListViewModel: MusicListViewModel
        } ) );
    }

    /**
     * 音楽プレーヤーが更新された時に発生します。
     */
    _onAudioPlayerChange() {
        this.setState( {
            currentPlay:  AudioPlayerStore.current(),
            playState:    AudioPlayerStore.playState(),
            duration:     AudioPlayerStore.duration(),
            playbackTime: AudioPlayerStore.playbackTime(),
            volume:       AudioPlayerStore.volume()
        } );
    }

    /**
     * 音楽リストが更新された時に発生します。
     */
    _onMusicListChange() {
        if( this.state.playState === PlayState.STOPPED ) {
            this.setState( {
                musics:      MusicListStore.getAll(),
                current:     MusicListStore.current(),
                currentPlay: MusicListStore.current()
            } );
        } else {
            this.setState( {
                musics:  MusicListStore.getAll(),
                current: MusicListStore.current()
            } );
        }
    }
}

/**
 * コンポーネント処理を開始します。
 *
 * @param {Object} query コンポーネントの配置対象となる DOM を示すクエリ。
 *
 * @return {Object} コンポーネント。
 */
export default ( query ) => {
    return React.render(
        <MainViewModel />,
        document.querySelector( query )
    );
}
