import type { Endpoints } from '../types';


export function sanitize ( value: unknown, delimiter: string = '-' ) : string {
  return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
}

export function list < T > (
  endpoints: Endpoints, items: readonly ( T & { uri: string } )[], total = items.length
) {
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
    filter ( predicate: ( item: T ) => boolean ) { return items.filter( predicate ) },

    page ( page: number, perPage: number = 10 ) {
      const start = ( page - 1 ) * perPage, end = start + perPage;
      return list( endpoints, items.slice( start, end ), total );
    }
  } );
};
