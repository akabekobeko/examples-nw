/**
 * ファイル選択ダイアログを提供します。
 *
 */
export class OpenFileDialog {
    /**
     * インスタンスを初期化します。
     *
     * @param {String}   accept   種別。
     * @param {Boolean}  multiple 複数選択するなら true。
     * @param {Function} callback ダイアログが閉じられる時に呼び出される関数。
     */
    constructor( accept, multiple, callback ) {
        /**
         * input 要素。
         * @type {Element}
         */
        this._element = document.createElement( 'input' );
        this._element.setAttribute( 'type', 'file' );
        this._element.addEventListener( 'change', ( ev ) => {
            if( this._callback ) {
                this._callback( ev.target.file || ev.target.files );
            }
        } );

        /**
         * ダイアログが閉じられる時に呼び出される関数。
         * @type {Function}
         */
        this._callback = callback;

        this.setAccept( accept );
        this.setMultipe( multiple );
    }

    /**
     * ダイアログを表示します。
     *
     * @param {Function} callback ダイアログが閉じられる時に呼び出される関数。
     */
    show( callback ) {
        if( callback ) {
            this._callback = callback;
        }

        this._element.click();
    }

    /**
     * ダイアログで開くファイル種別を設定します。
     *
     * @param {String} accept 種別。
     */
    setAccept( accept ) {
        this._element.setAttribute( 'accept', accept );
    }

    /**
     * 複数ファイルを選択するための値を設定します。
     *
     * @param {Boolean} multiple 複数選択するなら true。
     */
    setMultipe( multiple ) {
        if( multiple ) {
            this._element.setAttribute( 'multiple', true );
            this._element.setAttribute( 'name', 'files[]' );

        } else {
            this._element.removeAttribute( 'multiple' );
            this._element.setAttribute( 'name', 'file' );
        }
    }
}
