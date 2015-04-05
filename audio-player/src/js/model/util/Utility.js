import assign from 'object-assign';

/**
 * ユーティリティ関数を提供します。
 * 
 * @type {Object}
 */
export default {
    /**
     * 秒単位の演奏時間を文字列化します。
     *
     * @param {Number} duration 演奏時間 ( 秒単位 )。
     *
     * @return {String} 文字列化された演奏時間。
     */
    secondsToString( duration ) {
        const h = ( duration / 3600 | 0 );
        const m = ( ( duration % 3600 ) / 60 | 0 );
        const s = ( duration % 60 );

        function padding( num ) {
            return ( '0' + num ).slice( -2 );
        }

        return ( 0 < h ? h + ':' + padding( m ) + ':' + padding( s ) :
                 0 < m ?                      m + ':' + padding( s ) :
                                                 '0:' + padding( s ) );
    }
};
