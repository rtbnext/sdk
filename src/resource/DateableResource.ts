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
    const c = ( dates: string[] ) => this.collectDates( dates );

    return {
      items: dates, total, count: dates.length
    };
  }

  public dates () : Promise< unknown > {
    return this.transform( data => undefined );
  }
}
