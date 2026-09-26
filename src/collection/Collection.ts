import type { ItemFactory } from '../types/collection';


/**
 * Provides common immutable collection operations.
 * 
 * This class serves as a base for resource collections, providing methods to
 * manipulate and access the underlying items while maintaining immutability.
 */
export class Collection< T, R > {
  protected readonly factory: ItemFactory< T, R >;

  public readonly items: ReadonlyArray< T >;
  public readonly total: number;

  public constructor (
    items: ReadonlyArray< T >,
    factory: ItemFactory< T, R > = item => item as unknown as R,
    total?: number
  ) {
    this.items = items;
    this.factory = factory;
    this.total = total ?? items.length;
  }

  protected clone ( items: ReadonlyArray< T > ) : this {
    return new ( this.constructor as any )( items, this.factory, this.total );
  }

  public get count () : number {
    return this.items.length;
  }

  public get first () : R | undefined {
    return this.items.length ? this.factory( this.items[ 0 ] ) : undefined;
  }

  public get last () : R | undefined {
    return this.items.length ? this.factory( this.items[ this.items.length - 1 ] ) : undefined;
  }

  public [ Symbol.iterator ] () : Iterator< R > {
    return this.items.map( this.factory ).values();
  }

  public at ( index: number ) : R | undefined {
    return index >= 0 && index < this.count ? this.factory( this.items[ index ] ) : undefined;
  }

  public toArray () : R[] {
    return this.items.map( this.factory );
  }

  public map < U > ( callback: ( item: R, index: number ) => U ) : U[] {
    return this.toArray().map( callback );
  }

  public reversed () : this {
    return this.clone( [ ...this.items ].reverse() );
  }

  public take ( count: number ) : this {
    return this.clone( this.items.slice( 0, count ) );
  }

  public skip ( count: number ) : this {
    return this.clone( this.items.slice( count ) );
  }

  public slice ( start?: number, end?: number ) : this {
    return this.clone( this.items.slice( start, end ) );
  }

  public includes ( item: T ) : boolean {
    return this.items.includes( item );
  }
}
