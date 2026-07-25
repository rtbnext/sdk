import type { IMover, MoverIndex, MoverSnapshot } from '../types/endpoint';
import { ymd } from '../utils';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for mover resources.
 * 
 * Provides access to mover snapshots and mover index resources.
 */
export class Mover extends Endpoint implements IMover {
  /** Returns a mover snapshot for a given date. */
  public snapshot ( date: string ) : MoverSnapshot {
    return this.json( `v2/mover/${ ymd( date ) }.json` );
  }

  /** Returns the root mover index resource. */
  public get index () : MoverIndex {
    return this.json( 'v2/mover/index.json', {
      date: ( value: string ) => this.snapshot( value )
    } );
  }
}
