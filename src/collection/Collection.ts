/**
 * Provides common immutable collection operations.
 * 
 * This class serves as a base for resource collections, providing methods to
 * manipulate and access the underlying items while maintaining immutability.
 */
export class Collection< T, R > {
  public constructor (
    public readonly items: ReadonlyArray< T >,
    public readonly factory: ( item: T ) => R = item => item as unknown as R,
    public readonly total: number = items.length
  ) {}
}
