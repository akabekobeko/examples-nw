import React           from 'react';
import MainViewModel   from './vm/MainViewModel.js';
import DesignViewModel from './vm/DesignViewModel.js';

/**
 * アプリケーションのエントリー ポイントです。
 */
window.onload = () => {
  const render = ( vm ) => {
    React.render(
      React.createElement( vm, null ),
      document.querySelector( 'body' )
      );
  };

  if( window.testDesignMode ) {
    render( DesignViewModel );
  } else {
    render( MainViewModel );
  }
};
