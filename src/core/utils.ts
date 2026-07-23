import type { Collection, CollectionSearchFn, Entity } from '../types';


export function sanitize ( value: unknown, delimiter: string = '-' ) : string {
  return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
}

export function collection < T, E extends Entity< T > > (
  items: E[], search: CollectionSearchFn< T >, total: number = items.length
) : Collection< T > {
  const c = ( items: E[], t: number = total ) => collection( items, search, t );
  let idx = -1;

  return Object.freeze( {
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
      return c( items.filter( i => search( i, query, terms ) ) );
    },

    groupBy < K > ( callback: ( item: E ) => K ) {
      const groups = new Map< K, Collection< T > >();
      const map = new Map< K, E[] >();

      for ( const item of items ) {
        const key = callback( item ), group = map.get( key );
        if ( group ) group.push( item );
        else map.set( key, [ item ] );
      }

      for ( const [ key, group ] of map ) groups.set( key, c( group, group.length ) );
      return groups;
    },

    orderBy ( key: keyof T, dir: 'asc' | 'desc' = 'asc' ) {
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
    map < R > ( callback: ( item: E, index: number ) => R ) {
      return items.map( callback );
    },

    take ( count: number ) { return c( items.slice( 0, count ) ) },
    skip ( count: number ) { return c( items.slice( count ) ) },
    slice ( start?: number, end?: number ) { return c( items.slice( start, end ) ) },

    page ( page: number, perPage: number = 10 ) {
      const start = ( page - 1 ) * perPage, end = start + perPage;
      return c( items.slice( start, end ) );
    },

    [ Symbol.iterator ]() { return items[ Symbol.iterator ]() }
  } );
}
