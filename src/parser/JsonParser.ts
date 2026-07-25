import type { HttpResponse } from '../types/core';
import { TextParser } from './TextParser';


/**
 * Parses HTTP response bodies as JSON.
 * 
 * JsonParser extends TextParser and converts the decoded response text into an
 * object of the requested type.
 */
export class JsonParser extends TextParser {
  /**
   * Parses the response body as JSON and returns the typed data.
   * 
   * @template D - The expected output type.
   * @param res - The HTTP response to parse.
   * @returns The parsed JSON data.
   * @throws Error if JSON parsing fails.
   */
  public static override parse < D > ( res: HttpResponse ) : D {
    try { return JSON.parse( TextParser.parse( res ) ) as D }
    catch ( err ) { throw new Error( `Failed to parse JSON: ${
      err instanceof Error ? err.message : String( err )
    }` ) }
  }
}
