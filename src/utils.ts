/**
 * Sanitizes a string value by converting it to lowercase, trimming whitespace,
 * and replacing non-alphanumeric characters with a specified delimiter.
 * 
 * @param value - The value to sanitize.
 * @param delimiter - The character to replace non-alphanumeric characters with (default: '-').
 * @returns The sanitized string.
 */
export function sanitize ( value: unknown, delimiter: string = '-' ) : string {
  return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
}

/**
 * Converts a value to a UTC date string in the format 'YYYY-MM-DD'.
 * 
 * @param value - The value to convert to a date string.
 * @returns The UTC date string.
 */
export function ymd ( value: unknown ) : string {
  return new Date( Date.parse( String( value ) ) ).toISOString().slice( 0, 10 );
}
