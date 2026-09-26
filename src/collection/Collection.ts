import type { ItemFactory } from '../types/collection';


/**
 * Provides common immutable collection operations.
 * 
 * This class serves as a base for resource collections, providing methods to
 * manipulate and access the underlying items while maintaining immutability.
 * 
 * @template T - The type of the raw items contained in the collection.
 * @template R - The type of the resolved items returned by the collection.
 */
export abstract class Collection< T, R > {
  /** The factory used to resolve raw items into resources. */
  protected readonly factory: ItemFactory< T, R >;

  /** The raw items contained in the collection. */
  public readonly items: ReadonlyArray< T >;
  /** The total number of available items. */
  public readonly total: number;

  /**
   * Creates a new collection.
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
    this.items = items;
    this.factory = factory;
    this.total = total ?? items.length;
  }

  /**
   * Creates a new collection instance containing the specified items.
   * 
   * @param items - The raw items for the new collection.
   * @returns A new collection instance of the same type.
   */
  protected clone ( items: ReadonlyArray< T > ) : this {
    return new ( this.constructor as any )( items, this.factory, this.total );
  }

  /** Returns the number of items currently contained. */
  public get count () : number {
    return this.items.length;
  }

  /** Returns the first resolved item, or undefined if the collection is empty. */
  public get first () : R | undefined {
    return this.items.length ? this.factory( this.items[ 0 ] ) : undefined;
  }

  /** Returns the last resolved item, or undefined if the collection is empty. */
  public get last () : R | undefined {
    return this.items.length ? this.factory( this.items[ this.items.length - 1 ] ) : undefined;
  }

  /** Returns an iterator over the resolved items. */
  public [ Symbol.iterator ] () : Iterator< R > {
    return this.items.map( this.factory ).values();
  }

  /** Returns the runtime name of the collection class. */
  public get [ Symbol.toStringTag ] (): string {
    return this.constructor.name;
  }

  /**
   * Checks whether the collection contains the specified item.
   * 
   * @param item - The raw item to search for.
   * @returns True if the item is contained in the collection.
   */
  public includes ( item: T ) : boolean {
    return this.items.includes( item );
  }

  /**
   * Returns the resolved item at the specified index.
   * 
   * @param index - The zero-based item index.
   * @returns The resolved item, or undefined if the index is out of bounds.
   */
  public at ( index: number ) : R | undefined {
    return index >= 0 && index < this.count ? this.factory( this.items[ index ] ) : undefined;
  }

  /**
   * Returns all resolved items as an array.
   * 
   * @returns An array containing all resolved items.
   */
  public toArray () : R[] {
    return this.items.map( this.factory );
  }

  /**
   * Maps the resolved items using the specified callback.
   * 
   * @template U - The type of the mapped values.
   * @param callback - The callback invoked for each resolved item.
   * @returns An array containing the mapped values.
   */
  public map < U > ( callback: ( item: R, index: number ) => U ) : U[] {
    return this.toArray().map( callback );
  }

  /**
   * Returns a new collection containing the items in reverse order.
   * 
   * @returns A new collection with reversed items.
   */
  public reversed () : this {
    return this.clone( [ ...this.items ].reverse() );
  }

  /**
   * Returns a new collection containing the first specified number of items.
   * 
   * @param count - The maximum number of items to include.
   * @returns A new collection containing the selected items.
   */
  public take ( count: number ) : this {
    return this.clone( this.items.slice( 0, count ) );
  }

  /**
   * Returns a new collection without the first specified number of items.
   * 
   * @param count - The number of items to skip.
   * @returns A new collection containing the remaining items.
   */
  public skip ( count: number ) : this {
    return this.clone( this.items.slice( count ) );
  }

  /**
   * Returns a new collection containing the items within the specified range.
   * 
   * @param start - The zero-based start index.
   * @param end - The exclusive end index.
   * @returns A new collection containing the selected items.
   */
  public slice ( start?: number, end?: number ) : this {
    return this.clone( this.items.slice( start, end ) );
  }
}
