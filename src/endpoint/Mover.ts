import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TMover } from '@rtbnext/schema/src/model/mover';
import type { DateableResource } from '../resource/DateableResource';
import type { Resource } from '../resource/Resource';
import { ymd } from '../utils';
import { Endpoint } from './Endpoint';


export class Mover extends Endpoint {
  public snapshot ( date: string ) : Resource< TMover > {
    return this.json( `v2/mover/${ ymd( date ) }.json` );
  }

  public get index () : DateableResource< TSnapshotIndex, Resource< TMover > > {
    return this.json( 'v2/mover/index.json', { date: ( value: string ) => this.snapshot( value ) } );
  }
}
