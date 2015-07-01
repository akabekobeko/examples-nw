import Assert from 'power-assert';
import Util   from '../src/js/model/Util.js';

/** @test {Util} */
describe( 'Util', () => {
  // 秒を時間文字列に変換
  /** @test {Util#secondsToString} */
  describe( 'secondsToString', () => {
    it( 'm:ss', () => {
      Assert( Util.secondsToString( 5 ) === '0:05' );
    } );

    it( 'mm:ss', () => {
      Assert( Util.secondsToString( 917 ) === '15:17' );
    } );

    it( 'h:mm:ss', () => {
      Assert( Util.secondsToString( 3704 ) === '1:01:44' );
    } );

    it( 'hh:mm:ss', () => {
      Assert( Util.secondsToString( 41018 ) === '11:23:38' );
    } );
  } );
} );
