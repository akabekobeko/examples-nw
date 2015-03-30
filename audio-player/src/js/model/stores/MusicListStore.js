import AppDispatcher    from '../dispatcher/AppDispatcher.js';
import {ActionTypes}    from '../constants/MusicListConstants.js';
import {OpenFileDialog} from '../util/FileDialog.js';
import {EventEmitter}   from 'events';
import assign           from 'object-assign';
import MusicList        from '../MusicList.js';

/**
 * イベント種別。
 * @type {String}
 */
var CHANGE_EVENT = 'change';

/**
 * 唯一の曲リスト操作オブジェクト。
 * @type {MusicList}
 */
var _musicList = new MusicList();

/**
 * 唯一の曲リスト。
 * @type {Array.<Music>}
 */
var _musics = [];

/**
 * リスト上で選択されている曲。
 * @type {Music}
 */
var _current = null;

/**
 * ファイル選択ダイアログ。
 * @type {OpenFileDialog}
 */
var _openFileDialog = new OpenFileDialog( 'audio/*', true, ( files ) => {
    if( !( files && 0 < files.length ) ) { return; }

    function onAdded( err, music ) {
        if( err ) {
            MusicListStore.emitChange( err, ActionTypes.ADD );
        } else {
            _musics.push( music );
            MusicListStore.emitChange( null, ActionTypes.ADD, music );
        }
    }

    for( var i = 0, max = files.length; i < max; ++i ) {
        _musicList.add( files[ i ], onAdded );        
    }
} );

/**
 * 音楽リストを初期化します。
 *
 * @param {Function} callback コールバック関数。
 */
function init() {
    _musicList.init( ( err ) => {
        if( err ) {
            MusicListStore.emitChange( err, ActionTypes.INIT );
        } else {
            _musicList.readAll( ( err, musics ) => {
                if( err ) {
                    MusicListStore.emitChange( err, ActionTypes.INIT );
                } else {
                    _musics = musics;
                    if( 0 < _musics.length ) {
                        _current = _musics[ 0 ];
                    }

                    MusicListStore.emitChange( null, ActionTypes.INIT );
                }
            } );
        }
    } );
}

/**
 * 曲を選択します。
 *
 * @param {Music} music 選択対象となる曲。
 *
 * @return {Boolean} 成功時は true。
 */
function select( music ) {
    if( _current && music && _current.id === music.id ) { return false; }

    var err = new Error( 'Failed to select the music, not found.' );
    for( var i = 0, max = _musics.length; i < max; ++i ) {
        if( music.id === _musics[ i ].id ) {
            err      = null;
            _current = music;
            break;
        }
    }

    MusicListStore.emitChange( err, ActionTypes.SELECT, music );
}

/**
 * 音声ファイルを追加します。
 */
function add() {
    _openFileDialog.show();
}

/**
 * 曲を削除します。
 *
 * @param {Number} musicId  削除対象となる曲の識別子。
 */
function remove( musicId ) {
    _musicList.remove( musicId, ( err ) => {
        if( err ) {
            MusicListStore.emitChange( err, ActionTypes.REMOVE, musicId );
        } else {
            err = new Error( 'Failed to remove the music, not found.' );
            for( var i = 0, max = _musics.length; i < max; ++i ) {
                if( _musics[ i ].id === musicId ) {
                    err = null;
                    _musics.splice( i, 1 );
                    break;
                }
            }

            MusicListStore.emitChange( err, ActionTypes.REMOVE, musicId );
        }
    } );
}

/**
 * アクションを処理します。
 * 
 * @param {Object} action AudioPlayerConstants に定義されたアクション。
 */
AppDispatcher.register( ( action ) => {
    switch( action.actionType ) {
    case ActionTypes.INIT:
        init();
        break;

    case ActionTypes.SELECT:
        select( action.music );
        break;

    case ActionTypes.ADD:
        add();
        break;

    case ActionTypes.REMOVE:
        remove( action.musicId );
        break;

    default:
        break;
    }
} );

/**
 * 曲リストを操作します。
 * @type {MusicListStore}
 */
var MusicListStore = assign( {}, EventEmitter.prototype, {
    /**
     * すべての曲を取得します。
     *
     * @return {Array.<Music>} 曲情報コレクション。
     */
    getAll: function() {
        return _musics;
    },

    /**
     * 現在選択されている曲を取得します。
     *
     * @return {Music} 曲情報。何も選択されていない場合は null。
     */
    current: function() {
        return _current;
    },

    /**
     * 次の曲を取得します。
     *
     * music が未指定の場合、曲リストで選択されているものの前の曲を取得します。
     * 指定された曲、または選択されている曲がリストの末尾だった場合は null を返します。
     *
     * @param {Music}   music 基準となる曲。
     * @param {Boolean} prev  前の曲を得る場合は true。既定は false。
     *
     * @return {Music} 成功時は曲情報。それ以外は null。
     */
    next: function( music, prev ) {
        var current = ( music ? music : _current );
        if( !( current ) ) { return null; }

        var index = -1;
        for( var i = 0, max = _musics.length; i < max; ++i ) {
            if( _musics[ i ].id === current.id ) {
                index = ( prev ? i - 1 : i + 1 );
                break;
            }
        }

        return ( 0 <= index && index < _musics.length ? _musics[ index ] : null );
    },

    /**
     * 更新を通知します。
     */
    emitChange: function( err, type, params ) {
        this.emit( CHANGE_EVENT, err, type, params );
    },

    /**
     * イベント リスナーを登録します。
     *
     * @param {Function} callback イベント リスナーとなる関数。
     */
    addChangeListener: function( callback ) {
        this.on( CHANGE_EVENT, callback );
    },

    /**
     * イベント リスナーの登録を解除します。
     *
     * @param {Function} callback イベント リスナーとなっている関数。
     */
    removeChangeListener: function( callback ) {
        this.removeListener( CHANGE_EVENT, callback );
    }
} );

export default MusicListStore;
