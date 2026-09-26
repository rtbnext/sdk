import { TimeSeriesCollection } from '../collection/TimeSeriesCollection';
import type { StateLoader } from '../core/StateLoader';
import type { ParserFn } from '../types/core';
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
  R extends TimePoint
> extends Resource< D > {
  /** Factory that converts a raw row into a typed time-series point. */
  private readonly point: PointFn< TimeSeriesRow, R >;

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
    point: PointFn< TimeSeriesRow, R >
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

  /**
   * Returns the parsed time-series data as a typed collection.
   * 
   * @returns The time-series collection.
   */
  public series () : Promise< TimeSeriesCollection< R > > {
    return this.transform( data => this.collectPoints( data ) );
  }
}
