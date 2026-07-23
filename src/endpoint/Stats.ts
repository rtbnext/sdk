import type { TDBStats, TGlobalStats, THistory, TProfileStats, TScatter, TScatterItem, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { CollectableResource } from '../core/resource/CollectableResource';
import type { Resource } from '../core/resource/Resource';
import { sanitize } from '../core/utils';
import type { Collection } from '../types';
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

  public scatter () : CollectableResource< TScatter, Collection< TScatterItem > > {
    return this.json( 'v2/stats/scatter.json', data =>
      this.endpoints.profile._collect( data.items, ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      } )
    );
  }

  public wealth () : Resource< TWealthStats > {
    return this.json< TWealthStats >( 'v2/stats/wealth.json' );
  }

  public history () : Resource< THistory > {
    return this.csv< THistory >( 'v2/stats/history.csv' );
  }
}
