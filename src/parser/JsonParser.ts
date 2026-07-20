import type { HttpResponse } from '../types';


export class JsonParser {
  protected static readonly decoder = new TextDecoder( 'utf-8' );
  private constructor () {}

  public static parse < T > ( res: HttpResponse ) : T {
    if ( ! res.ok ) throw new Error( `Request failed with status ${ res.status }.` );
    if ( ! res.body.byteLength ) throw new Error( 'Response contains no data.' );

    return JSON.parse( this.decoder.decode( res.body ) ) as T;
  }
}
