import type { THistoryItem } from '@rtbnext/schema/src/model/stats';

import type { DBStats, GlobalStats, HistoryPoint, ProfileStats, StatsEndpoint, StatsGroup } from '../types/endpoint';
import { Endpoint } from './Endpoint';


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
}
