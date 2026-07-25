import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { DateFn, DateOptions, Dates } from '../types/resource';
import { Resource } from './Resource';


export class DateableResource< D extends { dates: string[] }, R > extends Resource< D > {
  private readonly factory: DateFn< R >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: DateOptions< R > ) {
    super( path, loader, parser );
    this.factory = options.date;
  }

  private collectDates ( dates: string[], total: number = dates.length ) : Dates< R > {
    const self = this;

    const c = ( dates: string[] ) => self.collectDates( dates, total );
    const f = ( value?: string ) => value ? self.factory( value ) : null;

    return Object.freeze( {
      *[ Symbol.iterator ]() { for ( const date of dates ) yield self.factory( date ) },
      dates, total, count: dates.length,
    } );
  }

  public get () : Promise< Dates< R > > {
    return this.transform( data => this.collectDates( data.dates.toReversed() ) );
  }
}
