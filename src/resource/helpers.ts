/**
 * Provides methods for slicing items in a collection.
 * 
 * @template T - The type of items in the collection.
 * @template R - The type of the resulting collection after slicing.
 * @param items - The array of items to slice.
 * @param c - A function that takes an array of items and returns a collection of type R.
 * @returns An object containing methods for slicing the collection.
 */
export const sliceMethods = < T, R > ( items: T[], c: ( items: T[] ) => R ) => ( {
  take ( count: number ) { return c( items.slice( 0, count ) ) },
  skip ( count: number ) { return c( items.slice( count ) ) },
  slice ( start?: number, end?: number ) { return c( items.slice( start, end ) ) }
} );

/**
 * Provides methods for filtering items by date range based on a key extractor function.
 * 
 * @template T - The type of items in the collection.
 * @template R - The type of the resulting collection after filtering.
 * @param items - The array of items to filter.
 * @param c - A function that takes an array of items and returns a collection of type R.
 * @param key - A function that extracts a string key (e.g., date) from an item.
 * @returns An object containing methods for filtering by date range.
 */
export const rangeMethods = < T, R > ( items: T[], c: ( items: T[] ) => R, key: ( item: T ) => string ) => ( {
  before ( date: string ) { return c( items.filter( item => key( item ) < date ) ) },
  after ( date: string ) { return c( items.filter( item => key( item ) > date ) ) },
  since ( date: string ) { return c( items.filter( item => key( item ) >= date ) ) },
  until ( date: string ) { return c( items.filter( item => key( item ) <= date ) ) },
  between ( from: string, to: string ) { return c( items.filter( item => {
    const value = key( item ); return value >= from && value <= to;
  } ) ) }
} );

/**
 * Provides methods for filtering items by year and month based on a key extractor function.
 * 
 * @template T - The type of items in the collection.
 * @template R - The type of the resulting collection after filtering.
 * @param items - The array of items to filter.
 * @param c - A function that takes an array of items and returns a collection of type R.
 * @param key - A function that extracts a string key (e.g., date) from an item.
 * @returns An object containing methods for filtering by year and month.
 */
export const yearMonthMethods = < T, R > ( items: T[], c: ( items: T[] ) => R, key: ( item: T ) => string ) => ( {
  year ( year: number ) { return c( items.filter( item => key( item ).startsWith( `${ year }-` ) ) ) },
  month ( year: number, month: number ) {
    const prefix = `${ year }-${ String( month ).padStart( 2, '0' ) }-`;
    return c( items.filter( item => key( item ).startsWith( prefix ) ) );
  }
} );
