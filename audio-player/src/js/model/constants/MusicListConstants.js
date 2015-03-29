var keyMirror = require( 'react/lib/keyMirror' );

/**
 * 音楽リストの操作を表す定数を定義します。
 * @type {Object}
 */
module.exports = {
    /**
     * アクション種別。
     * @type {Object}
     */
    ActionTypes: keyMirror( {
        /** 音楽リストの初期化。 */
        INIT: null,

        /** 選択。 */
        SELECT: null,

        /** 音楽の追加。 */
        ADD: null,

        /** 音楽の削除。 */
        REMOVE: null,

        /** すべての音楽を消去。 */
        CLEAR: null
    } )
};
