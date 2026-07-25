import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { Collection, CollectOptions, Entity, EntityFn, SearchFn } from '../types/resource';
import { sanitize } from '../utils';
import { Resource } from './Resource';


const defaultSearch: SearchFn< any > = ( item, query, terms ) => false;


export class CollectableResource< D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > extends Resource< D > {
  private readonly entity: EntityFn< I, E >;
  private readonly search: SearchFn< I >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: CollectOptions< I, E > ) {
    super( path, loader, parser );
    this.entity = options.entity;
    this.search = options.search ?? defaultSearch;
  }

  private collectItems ( items: E[], total: number = items.length ) : Collection< I > {
    const s = this.search;
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

      find ( uriLike: string ) {
        const uri = sanitize( uriLike );
        return items.find( i => i.uri === uri || (
          'aliases' in i && Array.isArray( i.aliases ) && i.aliases.includes( uri )
        ) ) ?? null;
      },

      filter ( predicate: ( item: E ) => boolean ) {
        return c( items.filter( predicate ) );
      },

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

        for ( const item of [ ...items, ...other.items ] ) {
          if ( ! seen.has( item.uri ) ) {
            seen.add( item.uri );
            merged.push( item as E );
          }
        }

        return c( merged );
      },
    } );
  }

  public collection () : Promise< Collection< I > > {
    return this.transform( data => this.collectItems(
      data.items.map( i => this.entity( i ) )
    ) );
  }
}
