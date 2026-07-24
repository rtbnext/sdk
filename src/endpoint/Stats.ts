import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type {
  TDBStats, TGlobalStats, THistory, THistoryItem, TProfileStats, TScatter,
  TScatterItem, TStatsGroup, TWealthStats
} from '@rtbnext/schema/src/model/stats';
import type { CollectableResource } from '../resource/CollectableResource';
import type { IndexableResource } from '../resource/IndexableResource';
import type { Resource } from '../resource/Resource';
import type { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { HistoryPoint, ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


type StatsHistory = TimeSeriesResource< THistory, HistoryPoint >;
type StatsGroup< T extends string > = IndexableResource< TStatsGroup< T >[ 'index' ], StatsHistory >;


export class Stats extends Endpoint {
  public _point ( [ date, count, total, woman, quota, change, changePct ]: THistoryItem ) : HistoryPoint {
    return { date, count, total, woman, quota, change, changePct };
  }

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
    return this.json( 'v2/stats/wealth.json' );
  }

  public get history () : StatsHistory {
    return this.csv( 'v2/stats/history.csv', { point: row => this._point( row ) } );
  }

  public industry ( industry: TIndustry ) : StatsHistory {
    return this.csv( `v2/stats/industry/${ industry.toLowerCase() }.csv`, {
      point: row => this._point( row )
    } );
  }

  public get industryIndex () : StatsGroup< TIndustry > {
    return this.json( 'v2/stats/industry/index.json', {
      index: ( [ industry ] ) => this.industry( industry as TIndustry ),
      keys: value => value && typeof value === 'object' && 'items' in value
        ? Object.keys( value.items as object ) : null
    } );
  }

  public citizenship ( isoCode: string ) : StatsHistory {
    return this.csv( `v2/stats/citizenship/${ isoCode.toUpperCase() }.csv`, {
      point: row => this._point( row )
    } );
  }

  public get citizenshipIndex () : StatsGroup< string > {
    return this.json( 'v2/stats/citizenship/index.json', {
      index: ( [ isoCode ] ) => this.citizenship( isoCode ),
      keys: value => value && typeof value === 'object' && 'items' in value
        ? Object.keys( value.items as object ) : null
    } );
  }
}
