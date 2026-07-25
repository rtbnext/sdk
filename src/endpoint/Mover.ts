import type { IMover, MoverIndex, MoverSnapshot } from '../types/endpoint';
import { ymd } from '../utils';
import { Endpoint } from './Endpoint';


export class Mover extends Endpoint implements IMover {
  public snapshot ( date: string ) : MoverSnapshot {
    return this.json( `v2/mover/${ ymd( date ) }.json` );
  }

  public get index () : MoverIndex {
    return this.json( 'v2/mover/index.json', {
      date: ( value: string ) => this.snapshot( value )
    } );
  }
}
