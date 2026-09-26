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

  /** Returns the current cursor position. */
  public get position () : number {
    return this.cursor;
  }

  /** Returns the current resolved item, or undefined if the cursor is out of bounds. */
  public get current () : R | undefined {
    return this.at( this.cursor );
  }

  /**
   * Advances the cursor and returns the next resolved item.
   * 
   * @returns The next resolved item, or undefined if no item exists.
   */
  public get next () : R | undefined {
    this.cursor++;
    return this.at( this.cursor );
  }

  /**
   * Moves the cursor backwards and returns the previous resolved item.
   * 
   * @returns The previous resolved item, or undefined if no item exists.
   */
  public get prev () : R | undefined {
    this.cursor--;
    return this.at( this.cursor );
  }
}
