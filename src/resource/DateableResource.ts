import type { ResourceLoader } from '../core/ResourceLoader';
import type { DateOptions, Dates, ParserFn } from '../types';
import { Resource } from './Resource';


export class DateableResource< D, R > extends Resource< D > {
  private readonly factory: ( value: string ) => R;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: DateOptions< R > ) {
    super( path, loader, parser );

    this.factory = options.date;
  }

  private collectDates ( values: string[], total: number = values.length ) : Dates< R > {
    const dates = [ ...values ].reverse(), self = this;
    const f = ( value?: string ) => value ? this.factory( value ) : null;
    const c = ( dates: string[] ) => this.collectDates( dates );

    return {
      items: dates, total, count: dates.length,

      get first () { return f( dates[ 0 ] ) },
      get last () { return f( dates.at( -1 ) ) },

      get ( date: string ) { return f( dates[ dates.indexOf( date ) ] ) },

      year ( year: number ) { return c( dates.filter( d => d.startsWith( `${ year }-` ) ) ) },
      month ( year: number, month: number ) {
        const prefix = `${ year }-${ String( month ).padStart( 2, '0' ) }-`;
        return c( dates.filter( d => d.startsWith( prefix ) ) );
      },

      before ( date: string ) { return c( dates.filter( d => d < date ) ) },
      after ( date: string ) { return c( dates.filter( d => d > date ) ) },
      since ( date: string ) { return c( dates.filter( d => d >= date ) ) },
      until ( date: string ) { return c( dates.filter( d => d <= date ) ) },
      between ( from: string, to: string ) { return c( dates.filter( d => d >= from && d <= to ) ) },

      toArray () { return dates.map( self.factory ) },
      map< T > ( callback: ( item: R, index: number ) => T ) {
        return dates.map( ( d, i ) => callback( self.factory( d ), i ) );
      },

      take ( count: number ) { return c( dates.slice( 0, count ) ) },
      skip ( count: number ) { return c( dates.slice( count ) ) },
      slice ( start?: number, end?: number ) { return c( dates.slice( start, end ) ) },

      *[ Symbol.iterator ]() { for ( const date of dates ) yield self.factory( date ) }
    };
  }

  public dates () : Promise< unknown > {
    return this.transform( data => undefined );
  }
}
