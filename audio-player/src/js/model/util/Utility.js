
/**
 * ユーティリティ関数を提供します。
 * 
 * @type {Object}
 */
module.exports = {
    /**
     * 複数オブジェクトを結合します。
     *
     * @param {Object} arguments 結合する値。可変長で指定可能。
     *
     * @return {Object} 結合されたオブジェクト。
     */
    mixin: function() {
        var assign = require( 'object-assign' );
        var obj    = {};

        for( var i = 0, max = arguments.length; i < max; ++i ) {
            if( arguments[ i ] ) {
                assign( obj, arguments[ i ] );
            }
        }

        return obj;
    },

    /**
     * 秒単位の演奏時間を文字列化します。
     *
     * @param {Number} duration 演奏時間 ( 秒単位 )。
     *
     * @return {String} 文字列化された演奏時間。
     */
    secondsToString: function( duration ) {
        var h = ( duration / 3600 | 0 );
        var m = ( ( duration % 3600 ) / 60 | 0 );
        var s = ( duration % 60 );

        function padding( num ) {
            return ( '0' + num ).slice( -2 );
        }

        return ( 0 < h ? h + ':' + padding( m ) + ':' + padding( s ) :
                 0 < m ?                      m + ':' + padding( s ) :
                                                 '0:' + padding( s ) );
    }
};
