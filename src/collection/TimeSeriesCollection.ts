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

    const date = new Date( Date.UTC( year, month - 1, day ) ), thursday = new Date( date );
    thursday.setUTCDate( date.getUTCDate() + 4 - ( date.getUTCDay() || 7 ) );

    const isoYear = thursday.getUTCFullYear(), first = new Date( Date.UTC( isoYear, 0, 1 ) );
    const week = Math.ceil( ( ( thursday.getTime() - first.getTime() ) / 86400000 + 1 ) / 7 );

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

      const values = sorted
        .map( point => ( point as Record< string, unknown > )[ key ] )
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
   * 
   * @param points - The aggregated points.
   * @returns A new time-series collection containing the aggregated points.
   */
  private aggregatedSeries ( points: ReadonlyArray< A > ) : TimeSeriesCollection< A > {
    return new TimeSeriesCollection< A >( points );
  }

  /** Returns all time-series points. */
  public get points () : R[] {
    return this.toArray();
  }

  /**
   * Returns the minimum numeric value.
   * 
   * @param callback - Optional function used to resolve numeric values.
   * @returns The minimum numeric value.
   */
  public min ( callback?: NumberCallback< R > ) : number {
    return Math.min( ...this.numbers( callback ) );
  }

  /**
   * Returns the maximum numeric value.
   * 
   * @param callback - Optional function used to resolve numeric values.
   * @returns The maximum numeric value.
   */
  public max ( callback?: NumberCallback< R > ) : number {
    return Math.max( ...this.numbers( callback ) );
  }

  /**
   * Returns the sum of all numeric values.
   * 
   * @param callback - Optional function used to resolve numeric values.
   * @returns The sum of all numeric values.
   */
  public sum ( callback?: NumberCallback< R > ) : number {
    return this.numbers( callback ).reduce( ( sum, value ) => sum + value, 0 );
  }

  /**
   * Returns the arithmetic mean of all numeric values.
   * 
   * @param callback - Optional function used to resolve numeric values.
   * @returns The arithmetic mean of all numeric values.
   */
  public avg ( callback?: NumberCallback< R > ) : number {
    const values = this.numbers( callback );
    return this.sum( callback ) / values.length;
  }

  /**
   * Returns the median of all numeric values.
   * 
   * @param callback - Optional function used to resolve numeric values.
   * @returns The median of all numeric values.
   */
  public median ( callback?: NumberCallback< R > ) : number {
    const values = [ ...this.numbers( callback ) ].sort( ( a, b ) => a - b );
    const middle = Math.floor( values.length / 2 );

    return values.length % 2 ? values[ middle ] : ( values[ middle - 1 ] + values[ middle ] ) / 2;
  }

  /** Returns the date labels of all points. */
  public get labels () : string[] {
    return this.points.map( point => point.date );
  }

  /** Returns all point values grouped by property. */
  public get columns () : Record< keyof R, unknown[] > {
    const result = {} as Record< keyof R, unknown[] >;

    for ( const point of this.points )
      for ( const [ key, value ] of Object.entries( point ) )
        ( result[ key as keyof R ] ??= [] ).push( value );

    return result;
  }

  /**
   * Returns all values of a point property.
   * 
   * @template K - The property key of the point.
   * @param key - The property key to extract values for.
   * @returns An array of values for the specified property.
   */
  public column < K extends keyof R > ( key: K ) : R[ K ][] {
    return this.points.map( point => point[ key ] );
  }

  /**
   * Resolves one numeric value for each point.
   * 
   * @param callback - Function used to resolve numeric values.
   * @returns An array of numeric values.
   */
  public values ( callback: NumberCallback< R > ) : number[] {
    return this.points.map( callback );
  }

  /**
   * Aggregates points by a calendar period or custom grouping function.
   * 
   * @param period - The aggregation period or a function to group points.
   * @returns A new time-series collection containing the aggregated points.
   */
  public aggregate ( period: AggregatePeriod | ( ( point: R ) => string ) ) : TimeSeriesCollection< A > {
    const groups = new Map< string, R[] >();

    for ( const point of this.points ) {
      const key = typeof period === 'function' ? period( point ) : this.period( point.date, period );
      const group = groups.get( key ) ?? [];

      group.push( point );
      groups.set( key, group );
    }

    return this.aggregatedSeries( [ ...groups.entries() ].map(
      ( [ label, points ] ) => this.aggregatePoints( points, label )
    ) );
  }

  /**
   * Splits points into equally sized buckets and aggregates each bucket.
   * 
   * @param count - The number of buckets to create.
   * @returns A new time-series collection containing the aggregated buckets.
   */
  public buckets ( count: number ) : TimeSeriesCollection< A > {
    if ( count >= this.count ) return this.aggregatedSeries( this.points.map(
      ( point, i ) => this.aggregatePoints( [ point ], `${ i + 1 }/${ this.count }` )
    ) );

    const size = this.count / count, result: A[] = [];

    for ( let i = 0; i < count; i++ ) {
      const start = Math.floor( i * size ), end = Math.floor( ( i + 1 ) * size );
      const items = this.items.slice( start, end );

      result.push( this.aggregatePoints( items, `${ i + 1 }/${ count }` ) );
    }

    return this.aggregatedSeries( result );
  }
}
