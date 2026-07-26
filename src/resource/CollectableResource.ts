import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { Collection, CollectOptions, Entity, EntityFn, FindFn, SearchFn } from '../types/resource';
import { sanitize } from '../utils';
import { Resource } from './Resource';
import { sliceMethods } from './helpers';


/** Default URI lookup implementation for collectable resources. */
const defaultFind: FindFn< any > = ( items, uriLike ) => {
  const uri = sanitize( uriLike );
  return items.find( i => i.uri === uri ) ?? null;
}

/** Default search implementation for collectable resources. */
const defaultSearch: SearchFn< any > = ( item, query, terms ) => {
  const name = item.searchName ?? sanitize( item.name ?? '' ), text = item.text ?? '';

  return (
    name.includes( query ) || text.includes( query ) ||
    terms.every( t => name.includes( t ) || text.includes( t ) )
  );
};


/**
 * A resource wrapper for collection-oriented endpoints.
 * 
 * This class enables collecting items, searching, filtering, and paging.
 * 
 * @template D - The raw data type of the resource, which must include an `items` array.
 * @template I - The type of individual items in the collection, which must include a `uri` string.
 * @template E - The entity type that wraps individual items, extending the base `Entity` interface.
 */
export class CollectableResource< D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > extends Resource< D > {
  /** Converts raw item payloads into collection entity instances. */
  private readonly entity: EntityFn< I, E >;
  /** Custom item lookup function by URI-like string. */
  private readonly find: FindFn< I >;
  /** Custom search predicate used by the collection search implementation. */
  private readonly search: SearchFn< I >;

  /**
   * Creates a new instance of `CollectableResource`.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param options - Configuration options for entity conversion, lookup, and search behavior.
   */
  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: CollectOptions< I, E > ) {
    super( path, loader, parser );

    this.entity = options.entity;
    this.find = options.find ?? defaultFind;
    this.search = options.search ?? defaultSearch;
  }

  /**
   * Builds a collection object from the parsed entity list.
   * 
   * @param items - The entity items to include in the collection.
   * @param total - The total number of available items.
   * @returns A frozen collection instance.
   */
  private collectItems ( items: E[], total: number = items.length ) : Collection< I > {
    const s = this.search, f = this.find;
    const c = ( items: E[], t: number = total ) => this.collectItems( items, t );
    let idx = -1;

    return Object.freeze( {
      *[ Symbol.iterator ]() { yield* items },
      items, total, count: items.length,

      get position () { return idx },
      set position ( index: number ) { idx = index },

      get current () { return items[ idx ] ?? null },
      get first () { return items[ 0 ] ?? null },
      get last () { return items.at( -1 ) ?? null },

      get hasNext () { return idx + 1 < items.length },
      get hasPrev () { return idx > 0 },

      get next () { return items[ ++idx ] ?? null },
      get prev () { return items[ --idx ] ?? null },

      at ( index: number ) { return items[ index ] ?? null },
      get ( uri: string ) { return items.find( i => i.uri === uri ) ?? null },
      filter ( predicate: ( item: E ) => boolean ) { return c( items.filter( predicate ) ) },
      find ( uriLike: string ) { return f( items, uriLike ) },

      search ( query: string ) {
        const terms = sanitize( query, ' ' ).split( ' ' );
        return c( items.filter( i => s( i, query, terms ) ) );
      },

      intersect ( other: Collection< I > ) {
        const set = new Set( other.map( i => i.uri ) );
        return c( items.filter( i => set.has( i.uri ) ) );
      },

      exclude ( other: Collection< I > ) {
        const set = new Set( other.map( i => i.uri ) );
        return c( items.filter( i => ! set.has( i.uri ) ) );
      },

      union ( other: Collection< I > ) {
        const seen = new Set< string >(), merged: E[] = [];

        for ( const item of [ ...items, ...other.items ] ) if ( ! seen.has( item.uri ) )
          seen.add( item.uri ), merged.push( item as E );

        return c( merged );
      },

      groupBy < K > ( callback: ( item: E ) => K ) {
        const groups = new Map< K, Collection< I > >();
        const map = new Map< K, E[] >();

        for ( const item of items ) {
          const key = callback( item ), group = map.get( key );

          if ( group ) group.push( item );
          else map.set( key, [ item ] );
        }

        for ( const [ key, group ] of map ) groups.set( key, c( group, group.length ) );
        return groups;
      },

      orderBy ( key: keyof I, dir: 'asc' | 'desc' = 'asc' ) {
        const factor = dir === 'desc' ? -1 : 1;

        return c( [ ...items ].sort( ( a, b ) => {
          const av = a[ key ], bv = b[ key ];
          return av === bv ? 0 : av == null ? 1 : bv == null ? -1 : ( av < bv ? -1 : 1 ) * factor;
        } ) );
      },

      sort ( compare: ( a: E, b: E ) => number ) {
        return c( [ ...items ].sort( compare ) );
      },

      toArray () { return [ ...items ] },
      forEach ( callback: ( item: E, index: number ) => void ) { items.forEach( callback ) },
      map < R > ( callback: ( item: E, index: number ) => R ) { return items.map( callback ) },

      ...sliceMethods( items, c ),

      page ( page: number, perPage: number = 10 ) {
        const start = ( page - 1 ) * perPage, end = start + perPage;
        return c( items.slice( start, end ) );
      },

      *pages ( perPage: number = 10 ) {
        for ( let i = 0; i < items.length; i += perPage ) yield c( items.slice( i, i + perPage ) );
      }
    } );
  }

  /**
   * Returns the parsed collection as a collection object.
   * 
   * @returns A resolved collection instance.
   */
  public collection () : Promise< Collection< I > > {
    return this.transform( data => this.collectItems(
      data.items.map( i => this.entity( i ) )
    ) );
  }
}
