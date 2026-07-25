export const sliceMethods = < T, R > ( items: T[], c: ( items: T[] ) => R ) => ( {
  take ( count: number ) { return c( items.slice( 0, count ) ) },
  skip ( count: number ) { return c( items.slice( count ) ) },
  slice ( start?: number, end?: number ) { return c( items.slice( start, end ) ) }
} );

export const rangeMethods = < T, R > ( items: T[], c: ( items: T[] ) => R, key: ( item: T ) => string ) => ( {
  before ( date: string ) { return c( items.filter( item => key( item ) < date ) ) },
  after ( date: string ) { return c( items.filter( item => key( item ) > date ) ) },
  since ( date: string ) { return c( items.filter( item => key( item ) >= date ) ) },
  until ( date: string ) { return c( items.filter( item => key( item ) <= date ) ) },
  between ( from: string, to: string ) { return c( items.filter( item => {
    const value = key( item ); return value >= from && value <= to;
  } ) ) }
} );

export const yearMonthMethods = < T, R > ( items: T[], c: ( items: T[] ) => R, key: ( item: T ) => string ) => ( {
  year ( year: number ) { return c( items.filter( item => key( item ).startsWith( `${ year }-` ) ) ) },
  month ( year: number, month: number ) {
    const prefix = `${ year }-${ String( month ).padStart( 2, '0' ) }-`;
    return c( items.filter( item => key( item ).startsWith( prefix ) ) );
  }
} );
