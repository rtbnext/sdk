import type { TDBStats, TGlobalStats } from '@rtbnext/schema/src/model/stats';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public db () : Resource< TDBStats > {
    return this.json< TDBStats >( 'v2/stats/db.json' );
  }

  public global () : Resource< TGlobalStats > {
    return this.json< TGlobalStats >( 'v2/stats/global.json' );
  }
}
