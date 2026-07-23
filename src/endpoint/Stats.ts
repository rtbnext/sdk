import type { TDBStats, TGlobalStats, THistory, TProfileStats, TScatter, TScatterItem, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { CollectableResource } from '../resource/CollectableResource';
import type { Resource } from '../resource/Resource';
import type { ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public db () : Resource< TDBStats > {
    return this.json( 'v2/stats/db.json' );
  }

  public global () : Resource< TGlobalStats > {
    return this.json( 'v2/stats/global.json' );
  }

  public profile () : Resource< TProfileStats > {
    return this.json( 'v2/stats/profile.json' );
  }

  public scatter () : CollectableResource< TScatter, TScatterItem, ProfileEntity< TScatterItem > > {
    return this.endpoints.profile._collect( 'v2/stats/scatter.json', ( item, query, terms ) => {
      const name = sanitize( item.name );
      return name.includes( query ) || terms.every( t => name.includes( t ) );
    } );
  }

  public wealth () : Resource< TWealthStats > {
    return this.json< TWealthStats >( 'v2/stats/wealth.json' );
  }

  public history () : Resource< THistory > {
    return this.csv< THistory >( 'v2/stats/history.csv' );
  }
}
