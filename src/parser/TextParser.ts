import type { HttpResponse } from '../types';


export class TextParser {
  private static readonly decoder = new TextDecoder( 'utf-8' );

  public static parse ( res: HttpResponse ) : string {
    if ( ! res.ok ) throw new Error( `Request failed with status ${ res.status }.` );
    if ( ! res.body.byteLength ) throw new Error( 'Response contains no data.' );

    return this.decoder.decode( res.body );
  }
}
