export class Utils {
  public static sanitize ( value: unknown, delimiter: string = '-' ) : string {
    return String( value ).trim().toLowerCase().replace( /[^a-z0-9]+/g, delimiter )
      .replace( new RegExp( `[${ delimiter }]{2,}`, 'g' ), delimiter );
  }

  public static normalize ( value: string ) : string {
    return value.trim().toLowerCase().normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, '' )
      .replace( /[^a-z0-9\s-]/g, '' ).replace( /\s+/g, ' ' );
  }
}
