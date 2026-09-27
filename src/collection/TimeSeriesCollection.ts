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
> extends DateCollection< R, R > {}
