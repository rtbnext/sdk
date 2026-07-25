import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { AggregatePeriod, AggregatePoint, PointFn, TimeSeriesOptions } from '../types/resource';
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

  private aggregate < T extends { date: string } > ( points: T[], label?: string ) : AggregatePoint< T > {
    const sorted = [ ...points ].sort( ( a, b ) => a.date.localeCompare( b.date ) );
    const keys = Object.keys( sorted[ 0 ] );

    const result = {
      date: sorted.at( -1 )!.date, label: label ?? sorted.at( -1 )!.date,
      range: { from: sorted[ 0 ].date, to: sorted.at( -1 )!.date }
    } as AggregatePoint< T >;

    for ( const key of keys ) {
      if ( key === 'date' ) continue;

      const values = sorted.map( p => Number( p[ key as keyof T ] ) ).filter( Number.isFinite );
      if ( ! values.length ) continue;

      ( result as any )[ key ] = {
        first: values[ 0 ],
        last: values.at( -1 )!,
        min: Math.min( ...values ),
        max: Math.max( ...values ),
        avg: values.reduce( ( a, b ) => a + b, 0 ) / values.length,
        sum: values.reduce( ( a, b ) => a + b, 0 )
      };
    }

    return result;
  }
}
