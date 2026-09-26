import { DEFAULT_OPTIONS } from '../defaults';
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

  /** Advances the cursor and returns the next resolved item. */
  public get next () : R | undefined {
    this.cursor++;
    return this.at( this.cursor );
  }

  /** Moves the cursor backwards and returns the previous resolved item. */
  public get prev () : R | undefined {
    this.cursor--;
    return this.at( this.cursor );
  }

  /** Returns whether another item is available after the current position. */
  public get hasNext () : boolean {
    return this.cursor + 1 < this.count;
  }

  /** Returns whether another item is available before the current position. */
  public get hasPrev () : boolean {
    return this.cursor > 0;
  }

  /** Resets the cursor to its initial position. */
  public reset () : this {
    this.cursor = -1;
    return this;
  }

  /**
   * Moves the cursor to the specified position.
   * 
   * @param position - The zero-based cursor position.
   * @returns This collection instance.
   */
  public seek ( position: number ) : this {
    this.cursor = position;
    return this;
  }

  /**
   * Returns a new collection containing one page of items.
   * 
   * @param page - The one-based page number.
   * @param perPage - The number of items per page.
   * @returns A new collection containing the selected page.
   */
  public page ( page: number, perPage: number = DEFAULT_OPTIONS.collection.perPage ) : this {
    const start = Math.max( page - 1, 0 ) * perPage;
    return this.clone( this.items.slice( start, start + perPage ) );
  }

  /**
   * Returns all pages of the collection.
   * 
   * @param perPage - The number of items per page.
   * @returns An array containing all collection pages.
   */
  public pages ( perPage: number = DEFAULT_OPTIONS.collection.perPage ) : this[] {
    return Array.from(
      { length: Math.ceil( this.count / perPage ) },
      ( _, index ) => this.page( index + 1, perPage )
    );
  }
}
