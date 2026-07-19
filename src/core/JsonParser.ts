import { TextParser } from './TextParser';


export class JsonParser extends TextParser {
  public static override parse < T > ( raw: Uint8Array< ArrayBuffer > ) : T {
    return JSON.parse( super.parse( raw ) ) as T;
  }
}
