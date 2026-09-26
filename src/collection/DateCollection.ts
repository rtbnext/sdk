import type { DateResolver, ItemFactory } from '../types/collection';
import { ymd } from '../utils';
import { CursorCollection } from './CursorCollection';


/**
 * Provides date-related immutable collection operations.
 * 
 * This class extends the cursor collection with methods for filtering and
 * accessing items based on their associated dates.
 * 
 * @template T - The type of the raw items contained in the collection.
 * @template R - The type of the resolved items returned by the collection.
 */
export abstract class DateCollection< T, R > extends CursorCollection< T, R > {
  /** The resolver used to obtain the date from a raw item. */
  protected readonly date: DateResolver< T >;

  /**
   * Creates a new date collection.
   * 
   * @param items - The raw items contained in the collection.
   * @param factory - The factory used to resolve raw items into resources.
   * @param date - The resolver used to obtain the date from a raw item.
   * @param total - The total number of available items.
   */
  public constructor (
    items: ReadonlyArray< T >,
    factory: ItemFactory< T, R > = item => item as unknown as R,
    date: DateResolver< T > = item => item as unknown as string,
    total?: number
  ) {
    super( items, factory, total );
    this.date = date;
  }

  /** Returns the resolved date values of all items. */
  public get dates () : string[] {
    return this.items.map( this.date );
  }

  /** Returns the latest dated item. */
  public get latest () : R | undefined {
    return this.first;
  }

  /** Returns the oldest dated item. */
  public get oldest () : R | undefined {
    return this.last;
  }

  /**
   * Moves the cursor to the nearest available date on or before the target date.
   * 
   * @param position - The target date.
   * @returns This collection instance.
   */
  public override seek ( position: string ) : this {
    const target = ymd( position );
    this.cursor = this.items.findIndex( item => this.date( item ) <= target );

    return this;
  }

  /**
   * Returns the item matching the specified date.
   * 
   * @param date - The target date.
   * @returns The resolved item, or undefined if no matching item exists.
   */
  public find ( date: string ) : R | undefined {
    const target = ymd( date );
    const item = this.items.find( item => this.date( item ) === target );

    return item === undefined ? undefined : this.factory( item );
  }

  /**
   * Returns a new collection containing items from the specified year.
   * 
   * @param year - The year to filter by.
   * @returns A new collection containing the matching items.
   */
  public year ( year: number ) : this {
    const prefix = `${ year }-`;
    return this.clone( this.items.filter( item => this.date( item ).startsWith( prefix ) ) );
  }

  /**
   * Returns a new collection containing items from the specified month.
   * 
   * @param year - The year to filter by.
   * @param month - The month to filter by.
   * @returns A new collection containing the matching items.
   */
  public month ( year: number, month: number ) : this {
    const prefix = `${ year }-${ String( month ).padStart( 2, '0' ) }-`;
    return this.clone( this.items.filter( item => this.date( item ).startsWith( prefix ) ) );
  }

  /**
   * Returns a new collection containing items before the specified date.
   * 
   * @param date - The exclusive upper date boundary.
   * @returns A new collection containing the matching items.
   */
  public before ( date: string ) : this {
    const target = ymd( date );
    return this.clone( this.items.filter( item => this.date( item ) < target ) );
  }

  /**
   * Returns a new collection containing items after the specified date.
   * 
   * @param date - The exclusive lower date boundary.
   * @returns A new collection containing the matching items.
   */
  public after ( date: string ) : this {
    const target = ymd( date );
    return this.clone( this.items.filter( item => this.date( item ) > target ) );
  }

  /**
   * Returns a new collection containing items from the specified date onward.
   * 
   * @param date - The inclusive lower date boundary.
   * @returns A new collection containing the matching items.
   */
  public since ( date: string ) : this {
    const target = ymd( date );
    return this.clone( this.items.filter( item => this.date( item ) >= target ) );
  }

  /**
   * Returns a new collection containing items up to the specified date.
   * 
   * @param date - The inclusive upper date boundary.
   * @returns A new collection containing the matching items.
   */
  public until ( date: string ) : this {
    const target = ymd( date );
    return this.clone( this.items.filter( item => this.date( item ) <= target ) );
  }

  /**
   * Returns a new collection containing items within the specified date range.
   * 
   * @param start - The inclusive start date.
   * @param end - The inclusive end date.
   * @returns A new collection containing the matching items.
   */
  public between ( start: string, end: string ) : this {
    const s = ymd( start ), e = ymd( end );

    return this.clone( this.items.filter(
      item => s <= this.date( item ) && this.date( item ) <= e
    ) );
  }
}
