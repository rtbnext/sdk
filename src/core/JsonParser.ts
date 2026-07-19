export class JsonParser {
  protected static readonly decoder = new TextDecoder( 'utf-8' );
  private constructor () {}

  public static parse < T > ( raw: Uint8Array< ArrayBuffer > ) : T {
    return JSON.parse( this.decoder.decode( raw ) ) as T;
  }
}
