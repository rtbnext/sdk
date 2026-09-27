import type { TimePoint } from '../types/collection';
import type { TimeSeriesData } from '../types/resource';
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
> extends Resource< D > {}
