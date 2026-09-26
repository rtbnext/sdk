import type { ParserFn, ParserMode } from '../types/core';
import { CsvParser } from './CsvParser';
import { JsonParser } from './JsonParser';
import { TextParser } from './TextParser';


/**
 * Returns a parser function based on the specified parser mode.
 * 
 * @param mode - The parser mode to use ('text', 'json', or 'csv').
 * @returns A parser function that takes an HTTP response and returns the parsed data.
 * @throws An error if the specified parser mode is unsupported.
 */
export const parser = ( mode: ParserMode ) : ParserFn< unknown > => {
  switch ( mode ) {
    case 'text': return TextParser.parse;
    case 'json': return JsonParser.parse;
    case 'csv': return CsvParser.parse;

    default: throw new Error( `Unsupported parser mode: ${ mode }` );
  }
};
