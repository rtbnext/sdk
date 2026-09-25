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
}
