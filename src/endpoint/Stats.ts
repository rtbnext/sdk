import type { THistoryItem } from '@rtbnext/schema/src/model/stats';

import type { DBStats, GlobalStats, HistoryPoint, ProfileStats, Scatter, StatsEndpoint, StatsGroup, StatsHistory, WealthStats } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';
import { TIndustry } from '@rtbnext/schema/src/base/const';


/**
 * Endpoint implementation for statistics resources.
 * 
 * Provides various stats resources, scatter collections, and grouped indices.
 */
export class Stats extends Endpoint implements StatsEndpoint {
  /**
   * Converts a raw history row into a typed history point.
   * 
   * @param row - The raw stats history row.
   * @returns The converted, typed history point.
   */
  protected point ( [ date, count, total, woman, quota, change, changePct ]: THistoryItem ) : HistoryPoint {
    return { date, count, total, woman, quota, change, changePct };
  }

  /**
   * Builds an industry or citizenship stats group index.
   * 
   * @template K - The type of the group key, which must be a string.
   * @param group - The group type to build.
   * @returns The stats group index resource.
   */
  protected group < K extends string > ( group: 'industry' | 'citizenship' ) : StatsGroup< K > {
    return this.indexable( `v2/stats/${ group }/index.json`,
      ( [ key ] ) => this[ group ]( key ),
      value => value && typeof value === 'object' && 'items' in value
        ? Object.keys( value.items as object ) : null
    );
  }

  /** Database stats resource. */
  public get db () : DBStats {
    return this.resource( 'v2/stats/db.json' );
  }

  /** Global stats resource. */
  public get global () : GlobalStats {
    return this.resource( 'v2/stats/global.json' );
  }

  /** Profile stats resource. */
  public get profile () : ProfileStats {
    return this.resource( 'v2/stats/profile.json' );
  }

  /** Profile scatter stats collection resource. */
  public get scatter () : Scatter {
    return useProfile( this.endpoints.profile ).collect( 'v2/stats/scatter.json' );
  }

  /** Wealth stats resource. */
  public get wealth () : WealthStats {
    return this.resource( 'v2/stats/wealth.json' );
  }

  /** Historical stats time-series resource. */
  public get history () : StatsHistory {
    return this.series( 'v2/stats/history.csv', row => this.point( row ) );
  }

  /** Industry stats time series for a specific industry. */
  public industry ( industry: TIndustry ) : StatsHistory {
    return this.series( `v2/stats/industry/${ industry.toLowerCase() }.csv`,
      row => this.point( row )
    );
  }

  /** Citizenship stats time series for a specific country. */
  public citizenship ( isoCode: string ) : StatsHistory {
    return this.series( `v2/stats/citizenship/${ isoCode.toUpperCase() }.csv`,
      row => this.point( row )
    );
  }
}
