import type { HttpResponse } from '../types';
import { TextParser } from './TextParser';


export class JsonParser extends TextParser {
  public static override parse < D > ( res: HttpResponse ) : D {
    return JSON.parse( TextParser.parse( res ) ) as D;
  }
}
