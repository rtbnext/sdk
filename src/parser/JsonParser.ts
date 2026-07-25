import type { HttpResponse } from '../types/core';
import { TextParser } from './TextParser';


export class JsonParser extends TextParser {
  public static override parse < D > ( res: HttpResponse ) : D {
    try { return JSON.parse( TextParser.parse( res ) ) as D }
    catch ( err ) { throw new Error( `Failed to parse JSON: ${
      err instanceof Error ? err.message : String( err )
    }` ) }
  }
}
