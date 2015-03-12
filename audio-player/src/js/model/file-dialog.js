/**
 * ファイル選択ダイアログを提供します。
 *
 * @param {String}   accept   種別。
 * @param {Boolean}  multiple 複数選択するなら true。
 * @param {Function} callback ダイアログが閉じられる時に呼び出される関数。
 */
var OpenFileDialog = function( accept, multiple, callback ) {
    /**
     * input 要素。
     * @type {Element}
     */
    var _element = document.createElement( 'input' );

    /**
     * ダイアログが閉じられる時に呼び出される関数。
     * @type {Function}
     */
    var _callback = callback;

    /**
     * ダイアログを表示します。
     *
     * @param {Function} callback ダイアログが閉じられる時に呼び出される関数。
     */
    this.show = function( callback ) {
        if(callback){
            _callback=callback;
        }

        _element.click();
    };

    /**
     * ダイアログで開くファイル種別を設定します。
     *
     * @param {String} accept 種別。
     */
    this.setAccept = function( accept ) {
        _element.setAttribute( 'accept', accept );
    };

    /**
     * 複数ファイルを選択するための値を設定します。
     *
     * @param {Boolean} multiple 複数選択するなら true。
     */
    this.setMultipe = function( multiple ) {
        if( multiple ) {
            _element.setAttribute( 'multiple', true );
            _element.setAttribute( 'name', 'files[]' );

        } else {
            _element.removeAttribute( 'multiple' );
            _element.setAttribute( 'name', 'file' );
        }
    };

    _element.setAttribute( 'type', 'file' );
    _element.addEventListener( 'change', function( ev ) {
        if( _callback ) {
            _callback( ev.target.file || ev.target.files );
        }
    } );

    this.setAccept( accept );
    this.setMultipe( multiple );
};

/**
 * ファイル系ダイアログを提供します。
 * @type {Object}
 */
module.exports = {
    /**
     * ファイル選択ダイアログを生成します。
     *
     * @param {String}   accept   種別。
     * @param {Boolean}  multiple 複数選択するなら true。
     * @param {Function} callback ダイアログが閉じられる時に呼び出される関数。
     *
     * @return {OpenFileDialog} ファイル選択ダイアログ。
     */
    openFileDialog: function( accept, multiple, callback ) {
        return new OpenFileDialog( accept, multiple, callback );
    }
};