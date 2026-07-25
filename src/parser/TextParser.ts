import type { HttpResponse } from '../types/core';


/**
 * Parses HTTP response bodies into UTF-8 text.
 * 
 * The TextParser validates the response status and ensures the body contains
 * data before decoding it to a string.
 */
export class TextParser {
  /** The UTF-8 text decoder used to convert response bodies to strings. */
  private static readonly decoder = new TextDecoder( 'utf-8' );

  /**
   * Converts the HTTP response body to a text string.
   * 
   * @param res - The HTTP response to parse.
   * @returns The decoded response text.
   * @throws Error if the response is not ok or contains no data.
   */
  public static parse ( res: HttpResponse ) : string {
    if ( ! res.ok ) throw new Error( `Request failed with status ${ res.status }.` );
    if ( ! res.body.byteLength ) throw new Error( 'Response contains no data.' );

    return TextParser.decoder.decode( res.body );
  }
}
