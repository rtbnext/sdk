import type { HttpResponse } from '../types/core';
import { TextParser } from './TextParser';


/**
 * Parses CSV text responses into structured arrays.
 * 
 * The CsvParser extends TextParser and converts each non-empty line into an
 * array of string or numeric values, handling quoted fields and escaped quotes.
 */
export class CsvParser extends TextParser {
  /**
   * Parses an individual CSV field value, converting numeric strings to numbers.
   * 
   * @param value - The raw CSV field value.
   * @returns The trimmed string or parsed number.
   */
  private static parseValue ( value: string ) : string | number {
    const n = Number( value );
    return Number.isNaN( n ) ? value.trim() : n;
  }

  /**
   * Parses a single CSV line into an array of values.
   * 
   * @param line - A single line from the CSV payload.
   * @param delimiter - The delimiter separating values.
   * @returns An array of parsed string or numeric values.
   */
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
        values.push( CsvParser.parseValue( value ) );
        value = '';

        continue;
      }

      value += char;
    }

    values.push( CsvParser.parseValue( value ) );
    return values;
  }

  /**
   * Parses the HTTP response body as CSV and returns typed data.
   * 
   * @template D - The expected output type.
   * @param res - The HTTP response to parse.
   * @param delimiter - The delimiter separating values in the CSV.
   * @returns The parsed CSV data.
   */
  public static override parse < D > ( res: HttpResponse, delimiter: string = ',' ) : D {
    return TextParser.parse( res ).split( /\r?\n/ ).filter( l => l.trim().length > 0 )
      .map( l => CsvParser.parseLine( l, delimiter ) ) as D;
  }
}
