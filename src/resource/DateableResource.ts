import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { DateFn, DateOptions, Dates } from '../types/resource';
import { Resource } from './Resource';
import { rangeMethods, sliceMethods, yearMonthMethods } from './helpers';


/**
 * A resource wrapper for date-indexed endpoints.
 * 
 * This class exposes resource collections by date with filtering and paging.
 * 
 * @template D - The raw data type of the resource, which must include a `dates` array.
 * @template R - The type of individual date-indexed resources returned by the factory function.
 */
export class DateableResource< D extends { dates: string[] }, R > extends Resource< D > {
  /** Factory that converts a date string into a date-specific resource. */
  private readonly factory: DateFn< R >;

  /**
   * Creates a new instance of `DateableResource`.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param options - Configuration options for date-based resource conversion.
   */
  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: DateOptions< R > ) {
    super( path, loader, parser );
    this.factory = options.date;
  }

  /**
   * Wraps raw date strings into a date-indexed resource collection.
   * 
   * @param dates - The available date strings.
   * @param total - Total number of available dates.
   * @returns A frozen date collection instance.
   */
  private collectDates ( dates: string[], total: number = dates.length ) : Dates< R > {
    const self = this;

    const c = ( dates: string[] ) => self.collectDates( dates, total );
    const f = ( value?: string ) => value ? self.factory( value ) : null;

    return Object.freeze( {
      *[ Symbol.iterator ]() { for ( const date of dates ) yield self.factory( date ) },
      dates, total, count: dates.length,

      get first () { return f( dates[ 0 ] ) },
      get last () { return f( dates.at( -1 ) ) },

      find ( date: string ) { return f( dates.find( d => d === date ) ) },
      toArray () { return dates.map( self.factory ) },
      map < T > ( callback: ( item: R, index: number ) => T ) {
        return dates.map( ( d, i ) => callback( self.factory( d ), i ) );
      },

      ...sliceMethods( dates, c ),
      ...yearMonthMethods( dates, c, d => d ),
      ...rangeMethods( dates, c, d => d )
    } );
  }

  /**
   * Returns the date-indexed resource collection.
   * 
   * @returns A resolved dated collection.
   */
  public get () : Promise< Dates< R > > {
    return this.transform( data => this.collectDates( [ ...data.dates ].reverse() ) );
  }
}
