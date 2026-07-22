import type { TDBStats, TGlobalStats, THistory, TProfileStats, TScatter, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public db () : Resource< TDBStats > {
    return this.json< TDBStats >( 'v2/stats/db.json' );
  }

  public global () : Resource< TGlobalStats > {
    return this.json< TGlobalStats >( 'v2/stats/global.json' );
  }

  public profile () : Resource< TProfileStats > {
    return this.json< TProfileStats >( 'v2/stats/profile.json' );
  }

  public scatter () : Resource< TScatter > {
    return this.json< TScatter >( 'v2/stats/scatter.json' );
  }

  public wealth () : Resource< TWealthStats > {
    return this.json< TWealthStats >( 'v2/stats/wealth.json' );
  }

  public history () : Resource< THistory > {
    return this.csv< THistory >( 'v2/stats/history.csv' );
  }
}
