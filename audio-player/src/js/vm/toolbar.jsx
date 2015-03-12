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
            openFileDialog: FileDialog.openFileDialog( 'audio/*', true, this.onAddFiles )
        };
    },

    /**
     * コンポーネントを描画します。
     *
     * @return {Object} React エレメント。
     */
    render: function() {
        return (
            <div className="toolbar">
                <div className="wrapper">
                    <div className="player">
                        <div className="button" onClick={this.onPressPrevButton}><i className="icon-prev"></i></div>
                        <div className="button" onClick={this.onPressPlayButton}><i className="icon-play"></i></div>
                        <div className="button" onClick={this.onPressNextButton}><i className="icon-next"></i></div>
                        <input type="range" onChange={this.onVolumeChange} />
                    </div>
                    <div className="display">
                        <div className="metadata">
                            <div className="title">Title</div>
                        </div>
                        <input className="position" type="range" onChange={this.onPositionChange} />
                    </div>
                    <div className="option">
                        <div className="wrapper">
                            <div className="button add" onClick={this.onPressAddButton}><i className="icon-add"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * 追加ボタンが押された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onPressAddButton: function( ev ) {
        //FileDialog.selectFiles();
        this.state.openFileDialog.show();
    },

    /**
     * 再生ボタンが押された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onPressPlayButton: function( ev ) {
    },

    /**
     * 前へボタンが押された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onPressPrevButton: function( ev ) {
    },

    /**
     * 次へボタンが押された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onPressNextButton: function( ev ) {
    },

    /**
     * 音声ボリュームが変更された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onVolumeChange: function( ev ) {
    },

    /**
     * 再生位置が変更された時に発生します。
     *
     * @param {Object} ev イベント情報。
     */
    onPositionChange: function( ev ) {
    },

    /**
     * ファイルが追加される時に発生します。
     *
     * @param  {FileList} files ファイル情報コレクション。
     */
    onAddFiles: function( files ) {
        if( this.props.onAddFiles ) {
            this.props.onAddFiles( files );
        }
    }
} );

module.exports = Toolbar;