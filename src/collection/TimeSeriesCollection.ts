import type { AggregatePeriod, AggregatePoint, NumberCallback, TimePoint } from '../types/collection';
import { DateCollection } from './DateCollection';


/**
 * Provides statistical and aggregation operations for time-series data.
 * 
 * This class extends the date collection with numeric statistics,
 * column access, period aggregation, and bucket aggregation.
 * 
 * @template R - The type of the time-series points.
 * @template A - The type of aggregated time-series points.
 */
export class TimeSeriesCollection<
  R extends TimePoint,
  A extends AggregatePoint< R > = AggregatePoint< R >
> extends DateCollection< R, R > {
  /**
   * Returns all numeric values from the collection.
   * 
   * When a callback is provided, only the value returned by the callback
   * for each point is included. Otherwise all numeric properties except
   * the date are collected.
   * 
   * @param callback - Optional function used to resolve numeric values.
   */
  private numbers ( callback?: NumberCallback< R > ) : number[] {
    if ( callback ) return this.toArray().map( point => callback( point ) );

    return this.toArray().flatMap( point => Object.entries( point )
      .filter( ( [ key, value ] ) => key !== 'date' && typeof value === 'number' )
      .map( ( [ , value ] ) => value as number )
    );
  }
}
