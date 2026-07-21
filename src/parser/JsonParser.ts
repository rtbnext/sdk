import type { HttpResponse } from '../types';
import { TextParser } from './TextParser';


export class JsonParser extends TextParser {
  public static override parse < T > ( res: HttpResponse ) : T {
    return JSON.parse( TextParser.parse( res ) ) as T;
  }
}
