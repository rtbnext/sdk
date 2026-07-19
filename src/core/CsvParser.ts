export class CsvParser {
  protected static readonly decoder = new TextDecoder( 'utf-8' );
  private constructor () {}

  private static parseValue ( value: string ) : string | number {
    const n = Number( value );
    return Number.isNaN( n ) ? value.trim() : n;
  }

  private static parseLine ( line: string, delimiter: string ) : unknown[] {
    const values: unknown[] = [];
    let value = '', quoted = false;

    for ( let i = 0; i < line.length; i++ ) {
      const char = line[ i ];

      if ( char === '"' ) {
        if ( quoted && line[ i + 1 ] === '"' ) value += '"', i++;
        else quoted = ! quoted;

        continue;
      }

      if ( char === delimiter && ! quoted ) {
        values.push( this.parseValue( value ) );
        value = '';

        continue;
      }

      value += char;
    }

    values.push( this.parseValue( value ) );
    return values;
  }

  public static parse < T > ( raw: Uint8Array< ArrayBuffer >, delimiter: string = ';' ) : T[] {
    return this.decoder.decode( raw ).split( /\r?\n/ ).filter( l => l.trim().length > 0 )
      .map( l => this.parseLine( l, delimiter ) ) as T[];
  }
}
