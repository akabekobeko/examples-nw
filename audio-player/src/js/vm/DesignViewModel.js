import React         from 'react';
import ToolbarView   from '../view/ToolbarView.jsx';
import MusicListView from '../view/MusicListView.jsx';
import {PlayState}   from '../model/constants/AudioPlayerConstants.js';
import Util          from '../model/util/Utility.js';

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

        var musics = [
            { id: 1, title: 'test1', artist: 'artist1', album: 'album1', duration: 150 },
            { id: 2, title: 'test2', artist: 'artist2', album: 'album2', duration: 120 }
        ];

        this.state = {
            // 音楽リスト
            musics:        musics,
            current:       musics[ 0 ],
            onSelectMusic: this._onSelectMusic,
            onSelectPlay:  this._onSelectPlay,

            // ツールバー
            currentPlay:      musics[ 0 ],
            playState:        PlayState.STOPPED,
            duration:         musics[ 0 ].duration,
            playbackTime:     0,
            volume:           100,
            onPressButton:    this._onPressButton.bind( this ),
            onVolumeChange:   this._onVolumeChange.bind( this ),
            onPositionChange: this._onPositionChange.bind( this )
        };
    }

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render() {
        var comp = Util.mixin( this.state, { self: this } );
        return (
            <article className="app">
                {ToolbarView( comp )}
                {MusicListView( comp )}
            </article>
        );
    }

        /**
     * 音楽が選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectMusic( music ) {
        console.log( '_onSelectMusic' );
        this.setState( { current: music, currentPlay: music, duration: music.duration } );
    }

    /**
     * 音楽が再生対象として選択された時に発生します。
     *
     * @param {Object} music 音楽。
     */
    _onSelectPlay( music ) {
        console.log( '_onSelectPlay' );
    }

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton( type ) {
        console.log( '_onPressButton: type = ' + type );
    }

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange( ev ) {
        console.log( '_onVolumeChange: value = ' + ev.target.value );
        this.setState( { volume: ev.target.value } );
    }

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange( ev ) {
        console.log( '_onPositionChange: value = ' + ev.target.value );
        this.setState( { playbackTime: ev.target.value } );
    }
};

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
