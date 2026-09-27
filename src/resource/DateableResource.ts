import type { StateLoader } from '../core/StateLoader';
import type { ParserFn } from '../types/core';
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

  /**
   * Creates a new dateable resource.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource state loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param date - The factory used to resolve dates into resources.
   */
  public constructor ( path: string, loader: StateLoader, parser: ParserFn< D >, date: DateFn< R > ) {
    super( path, loader, parser );
    this.factory = date;
  }
}
