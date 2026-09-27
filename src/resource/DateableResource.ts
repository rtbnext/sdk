import type { DateData, DateFn } from '../types/resource';
import { Resource } from './Resource';


/**
 * A resource wrapper for date-indexed API endpoints.
 * 
 * This class provides lazy access to resources indexed by date values.
 * 
 * @template D - The raw data type of the resource.
 * @template R - The type of individual resources returned by the date factory.
 */
export class DateableResource< D extends DateData, R > extends Resource< D > {
  /** Factory that resolves a date into its corresponding resource. */
  private readonly factory: DateFn< R >;
}
