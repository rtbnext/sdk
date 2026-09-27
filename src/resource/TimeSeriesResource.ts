import { TimeSeriesCollection } from '../collection/TimeSeriesCollection';
import type { StateLoader } from '../core/StateLoader';
import type { TimePoint } from '../types/collection';
import type { ParserFn } from '../types/core';
import type { PointFn, TimeSeriesData } from '../types/resource';
import { Resource } from './Resource';


/**
 * A resource wrapper for time-series API endpoints.
 * 
 * This class converts raw rows into typed time-series points and exposes them
 * through a date-aware time-series collection.
 * 
 * @template D - The raw time-series data type.
 * @template R - The type of time-series points.
 */
export class TimeSeriesResource<
  D extends TimeSeriesData,
  R extends TimePoint
> extends Resource< D > {
  /** Factory that converts a raw row into a typed time-series point. */
  private readonly point: PointFn< D[ number ], R >;

  /**
   * Creates a new time-series resource.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource state loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param point - The factory used to convert rows into typed points.
   */
  public constructor (
    path: string, loader: StateLoader, parser: ParserFn< D >,
    point: PointFn< D[ number ], R >
  ) {
    super( path, loader, parser );
    this.point = point;
  }

  /**
   * Creates a time-series collection from raw rows.
   * 
   * @param rows - The raw time-series rows.
   * @returns A new time-series collection.
   */
  private collectPoints ( rows: D ) : TimeSeriesCollection< R > {
    return new TimeSeriesCollection< R >( [ ...rows ].reverse().map( this.point ) );
  }
}
