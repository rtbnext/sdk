import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TDBStats, TGlobalStats, THistory, TProfileStats, TScatter, TScatterItem, TStatsGroup, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { CollectableResource } from '../resource/CollectableResource';
import type { Resource } from '../resource/Resource';
import type { ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public get db () : Resource< TDBStats > {
    return this.json( 'v2/stats/db.json' );
  }

  public get global () : Resource< TGlobalStats > {
    return this.json( 'v2/stats/global.json' );
  }

  public get profile () : Resource< TProfileStats > {
    return this.json( 'v2/stats/profile.json' );
  }

  public get scatter () : CollectableResource< TScatter, TScatterItem, ProfileEntity< TScatterItem > > {
    return this.endpoints.profile._collect( 'v2/stats/scatter.json', ( item, query, terms ) => {
      const name = sanitize( item.name );
      return name.includes( query ) || terms.every( t => name.includes( t ) );
    } );
  }

  public get wealth () : Resource< TWealthStats > {
    return this.json< TWealthStats >( 'v2/stats/wealth.json' );
  }

  public get history () : Resource< THistory > {
    return this.csv< THistory >( 'v2/stats/history.csv' );
  }

  public get industryIndex () : Resource< TStatsGroup< TIndustry >[ 'index' ] > {
    return this.json( 'v2/stats/industry/index.json' );
  }

  public industry ( industry: TIndustry ) : Resource< THistory > {
    return this.csv( `v2/stats/industry/${ industry.toLowerCase() }.csv` );
  }

  public get citizenshipIndex () : Resource< TStatsGroup< string >[ 'index' ] > {
    return this.json( 'v2/stats/citizenship/index.json' );
  }

  public citizenship ( isoCode: string ) : Resource< THistory > {
    return this.csv( `v2/stats/citizenship/${ isoCode.toUpperCase() }.csv` );
  }
}
