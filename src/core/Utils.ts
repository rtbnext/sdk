import type { Endpoints } from '../types';


export const sanitize = ( value: unknown, delimiter: string = '-' ) : string =>
  String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );

export const list = < T > ( endpoints: Endpoints, index: T[] ) => {}
