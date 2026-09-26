import type { ItemFactory } from '../types/collection';


/**
 * Provides common immutable collection operations.
 * 
 * This class serves as a base for resource collections, providing methods to
 * manipulate and access the underlying items while maintaining immutability.
 */
export class Collection< T, R > {
  public readonly items: ReadonlyArray< T >;
  protected readonly factory: ItemFactory< T, R >;
  protected readonly total: number;

  public constructor (
    items: ReadonlyArray< T >,
    factory: ItemFactory< T, R > = item => item as unknown as R,
    total?: number
  ) {
    this.items = items;
    this.factory = factory;
    this.total = total ?? items.length;
  }

  private clone ( items: ReadonlyArray< T > ) : Collection< T, R > {
    return new Collection( items, this.factory, this.total );
  }
}
