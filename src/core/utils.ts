import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Profile } from '../endpoint/Profile';
import type { Collection, ProfileItem } from '../types';
import type { Resource } from './Resource';


export function sanitize ( value: unknown, delimiter: string = '-' ) : string {
  return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
}

export function profileItem < T > ( profile: Profile, item: T & { uri: string } ) : ProfileItem< T > {
  let meta: Resource< TProfileMetaData >;
  let data: Resource< TProfileData >;
  let history: Resource< TProfileHistory >;

  return Object.freeze( { ...item,
    get meta () { return meta ??= profile.profileMeta( item.uri ) },
    get data () { return data ??= profile.profileData( item.uri ) },
    get history () { return history ??= profile.profileHistory( item.uri ) }
  } );
}

export function collection < T > (
  items: ProfileItem< T >[],
  search: ( item: ProfileItem< T >, query: string, terms: string[] ) => boolean,
  total = items.length
) : Collection< T > {
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

    filter ( predicate: ( item: ProfileItem< T > ) => boolean ) {
      return collection( items.filter( predicate ), search, total );
    },

    search ( query: string ) {
      const terms = sanitize( query, ' ' ).split( ' ' );
      return collection( items.filter( i => search( i, query, terms ) ), search, total );
    },

    groupBy < K > ( callback: ( item: ProfileItem< T > ) => K ) {
      const groups = new Map< K, Collection< T > >();
      const map = new Map< K, ProfileItem< T >[] >();

      for ( const item of items ) {
        const key = callback( item ), group = map.get( key );
        if ( group ) group.push( item );
        else map.set( key, [ item ] );
      }

      for ( const [ key, group ] of map ) groups.set( key, collection( group, search, group.length ) );
      return groups;
    },

    orderBy ( key: keyof T, dir: 'asc' | 'desc' = 'asc' ) {
      const factor = dir === 'desc' ? -1 : 1;

      return collection( [ ...items ].sort( ( a, b ) => {
        const av = a[ key ], bv = b[ key ];
        return av === bv ? 0 : av == null ? 1 : bv == null ? -1 : ( av < bv ? -1 : 1 ) * factor;
      } ), search, total );
    },

    sort ( compare: ( a: ProfileItem< T >, b: ProfileItem< T > ) => number ) {
      return collection( [ ...items ].sort( compare ), search, total );
    },

    toArray () { return [ ...items ] },
    map < R > ( callback: ( item: ProfileItem< T >, index: number ) => R ) {
      return items.map( callback );
    },

    take ( count: number ) { return collection( items.slice( 0, count ), search, total ) },
    skip ( count: number ) { return collection( items.slice( count ), search, total ) },
    slice ( start?: number, end?: number ) { return collection( items.slice( start, end ), search, total ) },

    page ( page: number, perPage: number = 10 ) {
      const start = ( page - 1 ) * perPage, end = start + perPage;
      return collection( items.slice( start, end ), search, total );
    },

    [ Symbol.iterator ]() { return items[ Symbol.iterator ]() }
  } );
}
