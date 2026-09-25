import type { HttpResponse } from '../types/core';
import { TextParser } from './TextParser';


/**
 * Parses CSV text responses into structured arrays.
 * 
 * The CsvParser extends TextParser and converts each non-empty line into an
 * array of string or numeric values, handling quoted fields and escaped quotes.
 */
export class CsvParser extends TextParser {}
