import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { THistoryItem } from '@rtbnext/schema/src/model/stats';
import type { DBStats, GlobalStats, HistoryPoint, IStats, ProfileStats, StatsHistory, WealthStats } from '../types/endpoint';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint implements IStats {
  private point ( [ date, count, total, woman, quota, change, changePct ]: THistoryItem ) : HistoryPoint {
    return { date, count, total, woman, quota, change, changePct };
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
}
