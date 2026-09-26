import type { AggregatePeriod, AggregatePoint, NumberCallback, TimePoint } from '../types/resource';
import { DateCollection } from './DateCollection';


/**
 * Provides collection operations for time-series data.
 * 
 * This class extends the date collection with statistical calculations,
 * column access and aggregation operations.
 * 
 * @template R - The type of time-series points.
 * @template A - The type of aggregated time-series points.
 */
export class TimeSeriesCollection< R extends TimePoint, A extends AggregatePoint > extends DateCollection< R, R > {
  /**
   * Creates a new time-series collection.
   * 
   * @param items - The time-series points contained in the collection.
   * @param factory - The factory used to resolve points.
   * @param date - The resolver used to obtain point dates.
   * @param total - The total number of available points.
   */
  public constructor (
    items: ReadonlyArray< R >, factory: ( item: R ) => R = item => item,
    date: ( item: R ) => string = item => item.date, total?: number
  ) {
    super( items, factory, date, total );
  }
}
