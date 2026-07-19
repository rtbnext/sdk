export class TextParser {
  protected static readonly decoder = new TextDecoder( 'utf-8' );

  public static parse ( raw: Uint8Array< ArrayBuffer > ) : string {
    return this.decoder.decode( raw );
  }
}
