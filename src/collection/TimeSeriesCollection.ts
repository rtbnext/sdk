import type { AggregatePeriod, AggregatePoint, NumberCallback, TimePoint } from '../types/resource';
import { DateCollection } from './DateCollection';


/**
 * Provides collection operations for time-series data.
 * 
 * This class extends the date collection with statistical calculations,
 * column access and aggregation operations.
 * 
 * @template R - The type of time-series points.
 * @template A - The type of aggregated time-series points.
 */
export class TimeSeriesCollection< R extends TimePoint, A extends AggregatePoint > extends DateCollection< R, R > {
  /**
   * Creates a new time-series collection.
   * 
   * @param items - The time-series points contained in the collection.
   * @param factory - The factory used to resolve points.
   * @param date - The resolver used to obtain point dates.
   * @param total - The total number of available points.
   */
  public constructor (
    items: ReadonlyArray< R >, factory: ( item: R ) => R = item => item,
    date: ( item: R ) => string = item => item.date, total?: number
  ) {
    super( items, factory, date, total );
  }

  /**
   * Returns the numeric values represented by the collection.
   * 
   * Without a callback, all numeric point properties except `date` are used.
   * 
   * @param callback - Optional function used to extract a numeric value.
   * @returns The numeric values.
   */
  private numbers ( callback?: NumberCallback< R > ) : number[] {
    if ( callback ) return this.toArray().map( point => callback( point ) );

    return this.toArray().flatMap( point =>  Object.entries( point )
      .filter( ( [ key, value ] ) => key !== 'date' && typeof value === 'number' )
      .map( ( [ , value ] ) => value as number )
    );
  }

  /**
   * Creates an aggregation key from a date.
   * 
   * @param date - The date to group.
   * @param period - The aggregation period.
   * @returns The aggregation key.
   */
  private period ( date: string, period: AggregatePeriod ) : string {
    const [ year, month, day ] = date.split( '-' ).map( Number );

    if ( period === 'year' ) return String( year );
    if ( period === 'quarter' ) return `${ year }-Q${ Math.floor( ( month - 1 ) / 3 ) + 1 }`;
    if ( period === 'month' ) return `${ year }-${ String( month ).padStart( 2, '0' ) }`;

    const value = new Date( Date.UTC( year, month - 1, day ) );
    const thursday = new Date( value );
    thursday.setUTCDate( value.getUTCDate() + 4 - ( value.getUTCDay() || 7 ) );

    const isoYear = thursday.getUTCFullYear();
    const first = new Date( Date.UTC( isoYear, 0, 1 ) );
    const week = Math.ceil( ( ( thursday.getTime() - first.getTime() ) / 86400000 + 1 ) / 7 );

    return `${ isoYear }-W${ String( week ).padStart( 2, '0' ) }`;
  }

  /**
   * Aggregates a group of time-series points.
   * 
   * @param points - The points to aggregate.
   * @param label - Optional aggregation label.
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
        .map( point => point[ key ] )
        .filter( ( value ): value is number => typeof value === 'number' )
        .map( Number );

      if ( ! values.length ) continue;

      const ordered = [ ...values ].sort( ( a, b ) => a - b );
      const middle = Math.floor( ordered.length / 2 );

      result[ key ] = {
        first: values[ 0 ],
        last: values[ values.length - 1 ],
        min: Math.min( ...values ),
        max: Math.max( ...values ),
        avg: values.reduce( ( sum, value ) => sum + value, 0 ) / values.length,
        median: ordered.length % 2
          ? ordered[ middle ]
          : ( ordered[ middle - 1 ] + ordered[ middle ] ) / 2,
        sum: values.reduce( ( sum, value ) => sum + value, 0 )
      };
    }

    return result as A;
  }

  /**
   * Creates a collection containing aggregated points.
   * 
   * @param points - The aggregated points.
   * @returns A new time-series collection.
   */
  private aggregatedSeries ( points: ReadonlyArray< A > ) : TimeSeriesCollection< A, A > {
    return new TimeSeriesCollection< A, A >( points );
  }

  /** Returns all time-series points. */
  public get points () : R[] {
    return this.toArray();
  }

  /**
   * Returns the minimum numeric value.
   * 
   * @param callback - Optional function used to select the numeric value.
   * @returns The minimum value.
   */
  public min ( callback?: NumberCallback< R > ) : number {
    return Math.min( ...this.numbers( callback ) );
  }

  /**
   * Returns the maximum numeric value.
   * 
   * @param callback - Optional function used to select the numeric value.
   * @returns The maximum value.
   */
  public max ( callback?: NumberCallback< R > ) : number {
    return Math.max( ...this.numbers( callback ) );
  }

  /**
   * Returns the sum of numeric values.
   * 
   * @param callback - Optional function used to select the numeric value.
   * @returns The sum.
   */
  public sum ( callback?: NumberCallback< R > ) : number {
    return this.numbers( callback ).reduce( ( sum, value ) => sum + value, 0 );
  }

  /**
   * Returns the arithmetic mean of numeric values.
   * 
   * @param callback - Optional function used to select the numeric value.
   * @returns The average value.
   */
  public avg ( callback?: NumberCallback< R > ) : number {
    const values = this.numbers( callback );
    return this.sum( callback ) / values.length;
  }

  /**
   * Returns the median numeric value.
   * 
   * @param callback - Optional function used to select the numeric value.
   * @returns The median value.
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

  /** Returns all point values grouped by column. */
  public get columns () : Record< string, unknown[] > {
    const result: Record< string, unknown[] > = {};

    for ( const point of this.points )
      for ( const [ key, value ] of Object.entries( point ) )
        ( result[ key ] ??= [] ).push( value );

    return result;
  }

  /**
   * Returns numeric values mapped from the points.
   * 
   * @param callback - Function used to extract the numeric value.
   * @returns The mapped values.
   */
  public values ( callback: NumberCallback< R > ) : number[] {
    return this.points.map( callback );
  }

  /**
   * Returns all values of a column.
   * 
   * @param key - The column name.
   * @returns The column values.
   */
  public column ( key: string ) : unknown[] {
    return this.points.map( point => point[ key ] );
  }

  /**
   * Aggregates points by a predefined period or custom grouping function.
   * 
   * @param period - The aggregation period or grouping function.
   * @returns A collection containing the aggregated points.
   */
  public aggregate ( period: AggregatePeriod | ( ( point: R ) => string ) ) : TimeSeriesCollection< A, A > {
    const groups = new Map< string, R[] >();

    for ( const point of this.points ) {
      const key = typeof period === 'function' ? period( point ) : this.period( point.date, period );
      ( groups.get( key ) ?? groups.set( key, [] ).get( key )! ).push( point );
    }

    return this.aggregatedSeries( [ ...groups.entries() ].map( ( [ label, points ] ) =>
      this.aggregatePoints( points, label )
    ) );
  }

  /**
   * Splits points into equally sized buckets.
   * 
   * @param count - The number of buckets.
   * @returns A collection containing the aggregated buckets.
   */
  public buckets ( count: number ) : TimeSeriesCollection< A, A > {
    if ( count >= this.count ) return this.aggregatedSeries( this.points.map( ( point, index ) =>
      this.aggregatePoints( [ point ], `${ index + 1 }/${ this.count }` )
    ) );

    const size = this.count / count, result: A[] = [];

    for ( let index = 0; index < count; index++ ) {
      const start = Math.floor( index * size ), end = Math.floor( ( index + 1 ) * size );
      result.push( this.aggregatePoints( this.items.slice( start, end ), `${ index + 1 }/${ count }` ) );
    }

    return this.aggregatedSeries( result );
  }
}
