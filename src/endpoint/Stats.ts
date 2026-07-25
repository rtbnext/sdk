import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { THistoryItem } from '@rtbnext/schema/src/model/stats';
import type {
  DBStats, GlobalStats, HistoryPoint, IStats, ProfileStats, Scatter,
  StatsGroup, StatsHistory, WealthStats
} from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


export class Stats extends Endpoint implements IStats {
  protected point ( [ date, count, total, woman, quota, change, changePct ]: THistoryItem ) : HistoryPoint {
    return { date, count, total, woman, quota, change, changePct };
  }

  protected group < K extends string > ( group: 'industry' | 'citizenship' ) : StatsGroup< K > {
    return this.json( `v2/stats/${ group }/index.json`, {
      index: ( [ key ] ) => this[ group ]( key as any ),
      keys: value => value && typeof value === 'object' && 'items' in value
        ? Object.keys( value.items as object ) : null
    } );
  }

  public get db () : DBStats {
    return this.json( 'v2/stats/db.json' );
  }

  public get global () : GlobalStats {
    return this.json( 'v2/stats/global.json' );
  }

  public get profile () : ProfileStats {
    return this.json( 'v2/stats/profile.json' );
  }

  public get scatter () : Scatter {
    return profileProvider( this.endpoints.profile ).collect( 'v2/stats/scatter.json' );
  }

  public get wealth () : WealthStats {
    return this.json( 'v2/stats/wealth.json' );
  }

  public get history () : StatsHistory {
    return this.csv( 'v2/stats/history.csv', { point: row => this.point( row ) } );
  }

  public industry ( industry: TIndustry ) : StatsHistory {
    return this.csv( `v2/stats/industry/${ industry.toLowerCase() }.csv`, {
      point: row => this.point( row )
    } );
  }

  public citizenship ( isoCode: string ) : StatsHistory {
    return this.csv( `v2/stats/citizenship/${ isoCode.toUpperCase() }.csv`, {
      point: row => this.point( row )
    } );
  }

  public get industryIndex () : StatsGroup< TIndustry > {
    return this.group( 'industry' );
  }

  public get citizenshipIndex () : StatsGroup< string > {
    return this.group( 'citizenship' );
  }
}
