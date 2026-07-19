export class CsvParser {
  protected static readonly decoder = new TextDecoder( 'utf-8' );
  private constructor () {}

  private static parseValue ( value: string ) : string | number {
    const n = Number( value );
    return Number.isNaN( n ) ? value.trim() : n;
  }

  public static parse < T > ( raw: Uint8Array< ArrayBuffer > ) : T[] {
    const text = this.decoder.decode( raw );
  }
}
