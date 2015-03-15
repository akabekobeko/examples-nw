var React = require( 'react' );

/**
 * ツールバー用コンポーネントです。
 */
var Toolbar = React.createClass( {
    /**
     * コンポーネントの状態を初期化します。
     *
     * @return {Object} 初期化された状態オブジェクト。
     */
    getInitialState: function() {
        var FileDialog = require( '../model/file-dialog.js' );
        return {
            openFileDialog: FileDialog.openFileDialog( 'audio/*', true, this._onAddFiles )
        };
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        var title = this.props.music ? this.props.music.title : '';
        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        {this._renderButton( 'prev' )}
                        {this._renderButton( 'play' )}
                        {this._renderButton( 'next' )}
                        <input type="range" onChange={this.onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="title">{title}</div>
                        </div>
                        <input className="position" type="range" onChange={this.onPositionChange} />
                    </div>
                    <div className="option">
                        <div className="wrapper">
                            {this._renderButton( 'add' )}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * ボタンを描画します。
     *
     * @param {String} type ボタン種別。
     *
     * @return {Object} React エレメント。
     */
    _renderButton: function( type ) {
        return (
            <div className="button" onClick={this._onPressButton.bind( this, type )}>
                <i className={'icon-' + type}></i>
            </div>
        );
    },

    /**
     * ボタンが押された時に発生します。
     *
     * @param {String} type ボタン種別。
     */
    _onPressButton: function( type ) {
        switch( type ) {
        case 'play':
            break;

        case 'pause':
            break;

        case 'prev':
            break;

        case 'next':
            break;

        case 'add':
            this.state.openFileDialog.show();
            break;
        }
    },

    /**
     * ファイルが追加される時に発生します。
     *
     * @param  {FileList} files ファイル情報コレクション。
     */
    _onAddFiles: function( files ) {
        if( this.props.onAddFiles ) {
            this.props.onAddFiles( files );
        }
    }
} );

module.exports = Toolbar;