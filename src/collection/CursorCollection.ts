import type { ItemFactory } from '../types/collection';
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

  /**
   * Creates a new cursor collection.
   * 
   * @param items - The raw items contained in the collection.
   * @param factory - The factory used to resolve raw items into resources.
   * @param total - The total number of available items.
   */
  public constructor (
    items: ReadonlyArray< T >,
    factory: ItemFactory< T, R > = item => item as unknown as R,
    total?: number
  ) {
    super( items, factory, total );
  }
}
