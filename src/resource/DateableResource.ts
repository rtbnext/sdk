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
    const dates = [ ...values ].reverse();
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
      }
    };
  }

  public dates () : Promise< unknown > {
    return this.transform( data => undefined );
  }
}
