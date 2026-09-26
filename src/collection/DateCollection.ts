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
}
