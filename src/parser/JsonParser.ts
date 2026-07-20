import type { HttpResponse } from '../types';
import { TextParser } from './TextParser';


export class JsonParser extends TextParser {
  public static override parse < T > ( res: HttpResponse ) : T {
    return JSON.parse( super.parse( res ) ) as T;
  }
}
