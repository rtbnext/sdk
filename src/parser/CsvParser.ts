import { HttpResponse } from '../types';


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

  public static parse < T > ( res: HttpResponse, delimiter: string = ';' ) : T {
    if ( ! res.ok ) throw new Error( `Request failed with status ${ res.status }.` );
    if ( ! res.body.byteLength ) throw new Error( 'Response contains no data.' );

    return this.decoder.decode( res.body )
      .split( /\r?\n/ ).filter( l => l.trim().length > 0 )
      .map( l => this.parseLine( l, delimiter ) ) as T;
  }
}
