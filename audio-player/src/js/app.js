import AppContext               from './AppContext.js';
import { SetupDesignViewModel } from './vm/DesignViewModel.js';
import { SetupMainViewModel }   from './vm/MainViewModel.js';

/**
 * アプリケーション。
 * @type {AppContext}
 */
let context = null;

/**
 * アプリケーションのエントリー ポイントです。
 */
window.onload = () => {
  context = new AppContext();

  const selector = 'body';
  if( window.testDesignMode ) {
    SetupDesignViewModel( selector );
  } else {
    SetupMainViewModel( context, selector );
  }
};
