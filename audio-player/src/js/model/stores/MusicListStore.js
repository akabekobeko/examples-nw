var AppDispatcher      = require( '../dispatcher/AppDispatcher.js' );
var MusicListConstants = require( '../constants/MusicListConstants.js' );
var ActionTypes        = MusicListConstants.ActionTypes;
var EventEmitter       = require( 'events' ).EventEmitter;
var assign             = require( 'object-assign' );

/**
 * イベント種別。
 * @type {String}
 */
var CHANGE_EVENT = 'change';

/**
 * 唯一の音楽リスト操作オブジェクト。
 * @type {MusicList}
 */
var _musicList = new ( require( '../MusicList.js' ) )();

/**
 * 唯一の音楽リスト。
 * @type {Array.<Music>}
 */
var _musics = [];

/**
 * 現在選択されている音楽情報。
 * @type {Music}
 */
var _current = null;

/**
 * 音楽リストを操作します。
 * @type {MusicListStore}
 */
var MusicListStore = assign( {}, EventEmitter.prototype, {
    /**
     * すべての音楽を取得します。
     *
     * @return {Array.<Music>} 音楽情報コレクション。
     */
    getAll: function() {
        return _musics;
    },

    /**
     * 現在選択されている音楽情報を取得します。
     *
     * @return {Music} 音楽情報。何も選択されていない場合は null。
     */
    current: function() {
        return _current;
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
 * 音楽を選択します。
 *
 * @param {Music} music 選択対象となる音楽情報。
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
 *
 * @param {File}     file     ファイル情報。input[type="file"] で読み取った情報を指定してください。
 * @param {Function} callback 処理が完了した時に呼び出される関数。
 */
function add( file, callback ) {
    _musicList.add( file, function( err, music ) {
        if( err ) {
            callback( err );
        } else {
            _musics.push( music );
            callback();
        }
    } );
}

/**
 * 音楽情報を削除します。
 *
 * @param {Number}   musicId  削除対象となる音楽情報の識別子。
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
        add( action.file, callback );
        break;

    case ActionTypes.REMOVE:
        remove( action.musicId, callback );
        break;

    default:
        break;
    }
} );

module.exports = MusicListStore;
