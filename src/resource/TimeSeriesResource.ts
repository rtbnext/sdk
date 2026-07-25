import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { AggregatePeriod, PointFn, TimeSeriesOptions } from '../types/resource';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R extends { date: string } > extends Resource< D > {
  private readonly factory: PointFn< D, R >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: TimeSeriesOptions< D, R > ) {
    super( path, loader, parser );
    this.factory = options.point;
  }

  private period ( date: string, period: AggregatePeriod ) : string {
    const [ y, m, d ] = date.split( '-' ).map( Number );

    if ( period === 'year' ) return `${ y }`;
    if ( period === 'quarter' ) return `${ y }-Q${ Math.ceil( m / 3 ) }`;
    if ( period === 'month' ) return `${ y }-${ String( m ).padStart( 2, '0' ) }`;
    if ( period === 'week' ) return `${ y }-W${ String( Math.ceil( ( ( (
      new Date( Date.UTC( y, m - 1, d ) ).getTime() -
      new Date( Date.UTC( y, 0, 1 ) ).getTime()
    ) / 86400000 ) + 1 ) / 7 ) ).padStart( 2, '0' ) }`;

    throw new Error( `Invalid aggregate period: ${ period }` );
  }
}
