var AppDispatcher      = require( '../dispatcher/AppDispatcher.js' );
var MusicListConstants = require( '../constants/MusicListConstants.js' );
var ActionTypes        = MusicListConstants.ActionTypes;
var FileDialog         = require( '../util/FileDialog.js' );
var EventEmitter       = require( 'events' ).EventEmitter;
var assign             = require( 'object-assign' );

/**
 * イベント種別。
 * @type {String}
 */
var CHANGE_EVENT = 'change';

/**
 * 唯一の曲リスト操作オブジェクト。
 * @type {MusicList}
 */
var _musicList = new ( require( '../MusicList.js' ) )();

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
var _openFileDialog = FileDialog.openFileDialog( 'audio/*', true, function( files ) {
    if( !( files && 0 < files.length ) ) { return; }

    function onAdded( err, music ) {
        if( err ) {
            console.error( err );
        } else {
            _musics.push( music );
            MusicListStore.emitChange();
        }
    }

    for( var i = 0, max = files.length; i < max; ++i ) {
        _musicList.add( files[ i ], onAdded );        
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
    emitChange: function() {
        this.emit( CHANGE_EVENT );
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

/**
 * 音楽リストを初期化します。
 *
 * @param {Function} callback コールバック関数。
 */
function init( callback ) {
    _musicList.init( function( err ) {
        if( err ) {
            callback( err );
        } else {
            _musicList.readAll( function( err, musics ) {
                if( err ) {
                    callback( err );
                } else {
                    _musics = musics;
                    if( 0 < _musics.length ) {
                        _current = _musics[ 0 ];
                    }

                    callback();
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

    for( var i = 0, max = _musics.length; i < max; ++i ) {
        if( music.id === _musics[ i ].id ) {
            _current = music;
            return true;
        }
    }

    return false;
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
 * @param {Number}   musicId  削除対象となる曲の識別子。
 * @param {Function} callback コールバック関数。
 */
function remove( musicId, callback ) {
    _musicList.remove( musicId, function( err ){
        if( err ) {
            callback( err );
        } else {

            for( var i = 0, max = _musics.length; i < max; ++i ) {
                if( _musics.id === musicId ) {
                    _musics.splice( i, 1 );
                    break;
                }
            }

            callback();
        }
    } );
}

/**
 * アクションを処理します。
 * 
 * @param {Object} action AudioPlayerConstants に定義されたアクション。
 */
AppDispatcher.register( function( action ) {
    function callback( err ) {
        if( err ) {
            console.error( err );
        } else {
            MusicListStore.emitChange();
        }
    }

    switch( action.actionType ) {
    case ActionTypes.INIT:
        init( callback );
        break;

    case ActionTypes.SELECT:
        if( select( action.music ) ) {
            MusicListStore.emitChange();
        }
        break;

    case ActionTypes.ADD:
        add();
        break;

    case ActionTypes.REMOVE:
        remove( action.musicId, callback );
        break;

    default:
        break;
    }
} );

module.exports = MusicListStore;
