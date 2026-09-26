import { Collection } from './Collection';


/**
 * Provides cursor-related immutable collection operations.
 * 
 * This class extends the base collection with methods for navigating and
 * accessing items using a mutable cursor.
 * 
 * @template T - The type of the raw items contained in the collection.
 * @template R - The type of the resolved items returned by the collection.
 */
export abstract class CursorCollection< T, R > extends Collection< T, R > {
  /** The current cursor position. */
  protected cursor = -1;
}
