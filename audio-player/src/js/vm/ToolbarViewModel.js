import React              from 'react';
import ObjectAssign       from 'object-assign';
import {PlayState}        from '../model/constants/AudioPlayerConstants.js';
import MusicListActions   from '../model/actions/MusicListActions.js';
import MusicListStore     from '../model/stores/MusicListStore.js';
import AudioPlayerActions from '../model/actions/AudioPlayerActions.js';
import ToolbarView        from '../view/ToolbarView.jsx';

/**
 * ツールバー用コンポーネントです。
 *
 * @type {ReactClass}
*/
export default class ToolbarViewModel extends React.Component {
    /**
     * コンポーネントを初期化します。
     *
     * @param {Object} props プロパティ。
     */
    constructor( props ) {
        super( props );
    }

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render() {
        return ToolbarView( ObjectAssign( {}, this.props, {
            self:             this,
            onPressButton:    this._onPressButton,
            onVolumeChange:   this._onVolumeChange,
            onPositionChange: this._onPositionChange
        } ) );
    }

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton( type ) {
        switch( type ) {
        case 'play':
            this._play();
            break;

        case 'pause':
            AudioPlayerActions.pause();
            break;

        case 'prev':
            this._moveNext( true );
            break;

        case 'next':
            this._moveNext();
            break;

        case 'add':
            MusicListActions.add();
            break;

        case 'remove':
            this._remove();
            break;
        }
    }

    /**
     * 音量が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onVolumeChange( ev ) {
        AudioPlayerActions.volume( ev.target.value );
    }

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param  {Object} ev イベント情報。
     */
    _onPositionChange( ev ) {
        AudioPlayerActions.seek( ev.target.value );
    }

    /**
     * 曲を再生します。
     */
    _play() {
        if( this.props.playState === PlayState.STOPPED ) {
            AudioPlayerActions.play( this.props.currentPlay );
        } else {
            AudioPlayerActions.play();
        }
    }

    /**
     * 曲選択を変更します。
     *
     * @param  {Boolan} prev 前の曲を選ぶなら true。
     */
    _moveNext( prev ) {
        let music = MusicListStore.next( this.props.currentPlay, prev );
        if( !( music ) ) { return; }

        if( this.props.playState === PlayState.STOPPED ) {
            MusicListActions.select( music );
        } else {
            AudioPlayerActions.play( music );
        }
    }

    /**
     * 選択している曲を削除します。
     */
    _remove() {
        // リスト上の曲を対象とする
        const current = this.props.current;
        if( !( current ) ) { return; }

        const currentPlay = this.props.currentPlay;
        if( currentPlay && currentPlay.id === current.id ) {
            if( this.props.playState === PlayState.STOPPED ) {
                MusicListActions.remove( current.id );
            } else {
                alert( 'Failed to remove the music, is playing.' );
            }

        } else {
            MusicListActions.remove( current.id );
        }
    }
}
