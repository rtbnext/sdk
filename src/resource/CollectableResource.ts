import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { Collection, CollectOptions, Entity, EntityFn, FindFn, SearchFn } from '../types/resource';
import { sanitize } from '../utils';
import { Resource } from './Resource';


const defaultFind: FindFn< any > = ( items, uriLike ) => {
  const uri = sanitize( uriLike );
  return items.find( i => i.uri === uri ) ?? null;
}

const defaultSearch: SearchFn< any > = ( item, query, terms ) => false;


export class CollectableResource< D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > extends Resource< D > {
  private readonly entity: EntityFn< I, E >;
  private readonly find: FindFn< I >;
  private readonly search: SearchFn< I >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: CollectOptions< I, E > ) {
    super( path, loader, parser );

    this.entity = options.entity;
    this.find = options.find ?? defaultFind;
    this.search = options.search ?? defaultSearch;
  }

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
      map < R > ( callback: ( item: E, index: number ) => R ) { return items.map( callback ) },

      take ( count: number ) { return c( items.slice( 0, count ) ) },
      skip ( count: number ) { return c( items.slice( count ) ) },
      slice ( start?: number, end?: number ) { return c( items.slice( start, end ) ) },

      page ( page: number, perPage: number = 10 ) {
        const start = ( page - 1 ) * perPage, end = start + perPage;
        return c( items.slice( start, end ) );
      }
    } );
  }

  public collection () : Promise< Collection< I > > {
    return this.transform( data => this.collectItems(
      data.items.map( i => this.entity( i ) )
    ) );
  }
}
