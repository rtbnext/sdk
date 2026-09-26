import type { CollectItem, EntityFn, FindFn, SearchFn } from '../types/resource';
import { sanitize } from '../utils';
import { CursorCollection } from './CursorCollection';


/**
 * Default item finder.
 * 
 * @param items - The items to search.
 * @param uriLike - The URI-like value to find.
 * @returns The first matching item, or undefined.
 */
const defaultFind = < I extends CollectItem > (
  items: ReadonlyArray< I >, uriLike: string
) : I | undefined => {
  const uri = sanitize( uriLike );
  return items.find( item => item.uri === uri );
};

/**
 * Default search matcher.
 * 
 * @param item - The item to test.
 * @param query - The sanitized search query.
 * @param terms - The individual search terms.
 * @returns Whether the item matches the query.
 */
const defaultSearch = < I extends CollectItem > (
  item: I, query: string, terms: ReadonlyArray< string >
) : boolean => {
  const name = item.searchName || sanitize( item.name ?? '' ), text = item.text ?? '';

  return query.includes( name ) || query.includes( text ) || terms.every(
    term => name.includes( term ) || text.includes( term )
  );
};


/**
 * Provides collection operations for entity-based resources.
 * 
 * This class extends the cursor collection with searching, filtering,
 * grouping, sorting and set operations.
 * 
 * @template I - The type of raw collectable items.
 * @template E - The type of resolved entities.
 * @template K - The type of group keys.
 */
export class CollectCollection< I extends CollectItem, E > extends CursorCollection< I, E > {
  /** The function used to find items by URI-like values. */
  protected readonly findFn: FindFn< I >;
  /** The function used to test items against search queries. */
  protected readonly searchFn: SearchFn< I >;

  /**
   * Creates a new collectable collection.
   * 
   * @param items - The collectable items contained in the collection.
   * @param factory - The factory used to resolve items into entities.
   * @param total - The total number of available items.
   * @param find - Optional function used to find items by URI-like values.
   * @param search - Optional function used to match search queries.
   */
  public constructor (
    items: ReadonlyArray< I >, factory: EntityFn< I, E >, total?: number,
    find?: FindFn< I >, search?: SearchFn< I >
  ) {
    super( items, factory, total );

    this.findFn = find ?? defaultFind;
    this.searchFn = search ?? defaultSearch;
  }

  /**
   * Creates a new collection preserving its configuration.
   * 
   * @param items - The raw items for the new collection.
   * @returns A new collection instance of the same type.
   */
  protected override clone ( items: ReadonlyArray< I > ) : this {
    return new ( this.constructor as any )(
      items, this.factory, this.total, this.findFn, this.searchFn
    );
  }

  /**
   * Returns an entity by its exact URI.
   * 
   * @param uri - The exact URI to find.
   * @returns The resolved entity, or undefined.
   */
  public get ( uri: string ) : E | undefined {
    const item = this.items.find( item => item.uri === uri );
    return item === undefined ? undefined : this.factory( item );
  }

  /**
   * Returns a new collection containing items matching a predicate.
   * 
   * @param predicate - The predicate used to select items.
   * @returns A new filtered collection.
   */
  public filter ( predicate: ( item: I ) => boolean ) : this {
    return this.clone( this.items.filter( predicate ) );
  }

  /**
   * Returns the first entity matching a URI-like value.
   * 
   * @param uriLike - The URI-like value to find.
   * @returns The resolved entity, or undefined.
   */
  public find ( uriLike: string ) : E | undefined {
    const item = this.findFn( this.items, uriLike );
    return item === undefined ? undefined : this.factory( item );
  }

  /**
   * Returns a new collection containing items matching a search query.
   * 
   * @param query - The search query.
   * @returns A new collection containing the matching items.
   */
  public search ( query: string ) : this {
    const sanitized = sanitize( query ), terms = query.split( /\s+/ ).filter( Boolean );
    return this.clone( this.items.filter( item => this.searchFn( item, sanitized, terms ) ) );
  }

  /**
   * Returns the intersection with another collection.
   * 
   * @param other - The other collection.
   * @returns A new collection containing items present in both collections.
   */
  public intersect ( other: this ) : this {
    const uris = new Set( other.items.map( item => item.uri ) );
    return this.clone( this.items.filter( item => uris.has( item.uri ) ) );
  }

  /**
   * Returns a new collection excluding items from another collection.
   * 
   * @param other - The other collection.
   * @returns A new collection excluding matching items.
   */
  public exclude ( other: this ) : this {
    const uris = new Set( other.items.map( item => item.uri ) );
    return this.clone( this.items.filter( item => ! uris.has( item.uri ) ) );
  }

  /**
   * Returns the union of this collection and another collection.
   * 
   * Items are identified by their URI and occur only once in the result.
   * 
   * @param other - The other collection.
   * @returns A new collection containing the union of both collections.
   */
  public union ( other: this ) : this {
    const seen = new Set< string >(), merged: I[] = [];

    for ( const item of [ ...this.items, ...other.items ] )
      if ( ! seen.has( item.uri ) )
        seen.add( item.uri ), merged.push( item );

    return this.clone( merged );
  }

  /**
   * Groups items using a callback.
   * 
   * @template K - The type of the group keys.
   * @param callback - The function used to determine each item's group.
   * @returns A map containing one collection for each group.
   */
  public groupBy < K > ( callback: ( item: I ) => K ) : Map< K, this > {
    const groups = new Map< K, I[] >();

    for ( const item of this.items ) {
      const key = callback( item );
      const group = groups.get( key ) ?? [];

      group.push( item );
      groups.set( key, group );
    }

    return new Map( [ ...groups.entries() ].map(
      ( [ key, items ] ) => [ key, this.clone( items ) ]
    ) );
  }

  /**
   * Returns items ordered by an item property.
   * 
   * @param key - The property used for ordering.
   * @param descending - Whether to reverse the resulting order.
   * @returns A new ordered collection.
   */
  public orderBy ( key: string, descending: boolean = false ) : this {
    return this.clone( [ ...this.items ].sort( ( a, b ) => {
      const left = a[ key ], right = b[ key ];

      if ( left === right ) return 0;
      if ( left === undefined || left === null ) return 1;
      if ( right === undefined || right === null ) return -1;

      return left < right ? ( descending ? 1 : -1 ) : ( descending ? -1 : 1 );
    } ) );
  }

  /**
   * Returns items sorted using a custom key function.
   * 
   * @param key - The function used to obtain the sort value.
   * @param reverse - Whether to reverse the resulting order.
   * @returns A new sorted collection.
   */
  public sort ( key: ( item: I ) => string | number | boolean, reverse: boolean = false ) : this {
    return this.clone( [ ...this.items ].sort( ( a, b ) => {
      const left = key( a ), right = key( b );
      if ( left === right ) return 0;

      const result = left < right ? -1 : 1;
      return reverse ? -result : result;
    } ) );
  }
}
