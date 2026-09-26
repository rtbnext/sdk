import type { PointFn, TimePoint, TimeSeriesRow } from '../types/resource';
import { Resource } from './Resource';


/**
 * A resource wrapper for time-series API endpoints.
 * 
 * This class converts raw rows into typed time-series points and exposes them
 * through a date-aware time-series collection.
 * 
 * @template D - The raw time-series data type.
 * @template R - The type of time-series points.
 * @template A - The type of aggregated time-series points.
 */
export class TimeSeriesResource<
  D extends ReadonlyArray< TimeSeriesRow >,
  R extends TimePoint,
  A extends TimePoint
> extends Resource< D > {
  /** Factory that converts a raw row into a typed time-series point. */
  private readonly point: PointFn< TimeSeriesRow, R >;
}
