import type { THistoryItem } from '@rtbnext/schema/src/model/stats';

import type { HistoryPoint, StatsEndpoint } from '../types/endpoint';
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
}
