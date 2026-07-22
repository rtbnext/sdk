import type { TDBStats } from '@rtbnext/schema/src/model/stats';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public db () : Resource< TDBStats > {
    return this.json< TDBStats >( 'v2/stats/db.json' );
  }
}
