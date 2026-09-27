import type { AggregatePeriod, AggregatePoint, NumberCallback, TimePoint } from '../types/collection';
import { DateCollection } from './DateCollection';


/**
 * Provides statistical and aggregation operations for time-series data.
 * 
 * This class extends the date collection with numeric statistics,
 * column access, period aggregation, and bucket aggregation.
 * 
 * @template R - The type of the time-series points.
 * @template A - The type of aggregated time-series points.
 */
export class TimeSeriesCollection<
  R extends TimePoint,
  A extends AggregatePoint< R > = AggregatePoint< R >
> extends DateCollection< R, R > {
  /**
   * Returns all numeric values from the collection.
   * 
   * When a callback is provided, only the value returned by the callback
   * for each point is included. Otherwise all numeric properties except
   * the date are collected.
   * 
   * @param callback - Optional function used to resolve numeric values.
   */
  private numbers ( callback?: NumberCallback< R > ) : number[] {
    if ( callback ) return this.toArray().map( point => callback( point ) );

    return this.toArray().flatMap( point => Object.entries( point )
      .filter( ( [ key, value ] ) => key !== 'date' && typeof value === 'number' )
      .map( ( [ , value ] ) => value as number )
    );
  }

  /**
   * Creates an aggregation key for a date.
   * 
   * @param value - The date to group.
   * @param period - The aggregation period.
   * @returns The aggregation key.
   */
  private period ( value: string, period: AggregatePeriod ) : string {
    const [ year, month, day ] = value.split( '-' ).map( Number );

    if ( period === 'year' ) return String( year );
    if ( period === 'quarter' ) return `${ year }-Q${ Math.floor( ( month - 1 ) / 3 ) + 1 }`;
    if ( period === 'month' ) return `${ year }-${ String( month ).padStart( 2, '0' ) }`;

    const date = new Date( Date.UTC( year, month - 1, day ) );
    const thursday = new Date( date );

    thursday.setUTCDate( date.getUTCDate() + 4 - ( date.getUTCDay() || 7 ) );

    const isoYear = thursday.getUTCFullYear();
    const first = new Date( Date.UTC( isoYear, 0, 1 ) );
    const week = Math.ceil(
      ( ( thursday.getTime() - first.getTime() ) / 86400000 + 1 ) / 7
    );

    return `${ isoYear }-W${ String( week ).padStart( 2, '0' ) }`;
  }

  /**
   * Aggregates a group of points into a single summary point.
   * 
   * @param points - The points to aggregate.
   * @param label - Optional label for the aggregate point.
   * @returns The aggregated point.
   */
  private aggregatePoints ( points: ReadonlyArray< R >, label?: string ) : A {
    const sorted = [ ...points ].sort( ( a, b ) => a.date.localeCompare( b.date ) );
    const result: Record< string, unknown > = {
      date: sorted[ sorted.length - 1 ].date,
      label: label ?? sorted[ sorted.length - 1 ].date,
      range: {
        from: sorted[ 0 ].date,
        to: sorted[ sorted.length - 1 ].date
      }
    };

    for ( const key of Object.keys( sorted[ 0 ] ) ) {
      if ( key === 'date' ) continue;

      const values = sorted.map( point => ( point as any )[ key ] )
        .filter( ( value ): value is number => typeof value === 'number' );

      if ( ! values.length ) continue;

      const ordered = [ ...values ].sort( ( a, b ) => a - b );
      const middle = Math.floor( ordered.length / 2 );
      const sum = values.reduce( ( total, value ) => total + value, 0 );

      result[ key ] = {
        first: values[ 0 ],
        last: values[ values.length - 1 ],
        min: Math.min( ...values ),
        max: Math.max( ...values ),
        avg: sum / values.length,
        median: ordered.length % 2
          ? ordered[ middle ]
          : ( ordered[ middle - 1 ] + ordered[ middle ] ) / 2,
        sum
      };
    }

    return result as A;
  }

  /**
   * Creates a time-series collection from aggregated points.
   */
  private aggregatedSeries ( points: ReadonlyArray< A > ) : TimeSeriesCollection< A > {
    return new TimeSeriesCollection< A >( points );
  }
}
