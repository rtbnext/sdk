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
}
