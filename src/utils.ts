export function sanitize ( value: unknown, delimiter: string = '-' ) : string {
  return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
    .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
}

export function ymd ( value: unknown ) : string {
  return new Date( Date.parse( String( value ) ) ).toISOString().slice( 0, 10 );
}
