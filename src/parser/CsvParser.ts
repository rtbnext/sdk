import { HttpResponse } from '../types';
import { TextParser } from './TextParser';


export class CsvParser extends TextParser {
  private static parseValue ( value: string ) : string | number {
    const n = Number( value );
    return Number.isNaN( n ) ? value.trim() : n;
  }

  private static parseLine ( line: string, delimiter: string ) : ( string | number )[] {
    const values: ( string | number )[] = [];
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

  public static override parse < T > ( res: HttpResponse, delimiter: string = ';' ) : T {
    return super.parse( res ).split( /\r?\n/ ).filter( l => l.trim().length > 0 )
      .map( l => this.parseLine( l, delimiter ) ) as T;
  }
}
