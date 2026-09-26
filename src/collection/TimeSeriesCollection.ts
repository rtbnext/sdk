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
export class TimeSeriesCollection< R extends TimePoint, A extends AggregatePoint > extends DateCollection< R, R > {}
