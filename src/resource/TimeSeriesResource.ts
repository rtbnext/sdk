import type { ResourceLoader } from '../core/ResourceLoader';
import type { AggregatePeriod, AggregatePoint, ParserFn, TimeSeries, TimeSeriesOptions } from '../types';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R extends { date: string } > extends Resource< D > {
  private readonly factory: ( row: D[ number ] ) => R;

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

  private aggregate < T extends { date: string } >( points: T[] ) : AggregatePoint< T > {
    const result = { date: points[ 0 ].date } as AggregatePoint< T >;
    const keys = Object.keys( points[ 0 ] );

    for ( const key of keys ) {
      if ( key === 'date' ) continue;

      const values = points.map( p => Number( p[ key as keyof T ] ) ).filter( Number.isFinite );
      if ( ! values.length ) continue;

      ( result as any )[ key ] = {
        first: values[ 0 ], last: values.at( -1 )!,
        min: Math.min( ...values ), max: Math.max( ...values ),
        avg: values.reduce( ( a, b ) => a + b, 0 ) / values.length,
        sum: values.reduce( ( a, b ) => a + b, 0 )
      };
    }

    return result;
  }

  private createSeries < T extends { date: string } > ( points: T[], total: number = points.length ) : TimeSeries< T > {
    const self = this;

    const c = < U extends { date: string } >( points: U[] ) => this.createSeries( points, total );
    const d = ( point: T ) => String( point.date );
    const n = ( cb?: ( point: T ) => number ) => points.map( cb ?? ( p => Number( p ) ) );

    return Object.freeze( {
      points, total, count: points.length,

      get first () { return points[ 0 ] ?? null },
      get last () { return points.at( -1 ) ?? null },

      get ( date: string ) { return this.find( date ) },
      find ( date: string ) { return points.find( p => d( p ) === date ) ?? null },

      year ( year: number ) { return c( points.filter( p => d( p ).startsWith( `${ year }-` ) ) ) },
      month ( year: number, month: number ) {
        const prefix = `${ year }-${ String( month ).padStart( 2, '0' ) }-`;
        return c( points.filter( p => d( p ).startsWith( prefix ) ) );
      },

      before ( date: string ) { return c( points.filter( p => d( p ) < date ) ) },
      after ( date: string ) { return c( points.filter( p => d( p ) > date ) ) },
      since ( date: string ) { return c( points.filter( p => d( p ) >= date ) ) },
      until ( date: string ) { return c( points.filter( p => d( p ) <= date ) ) },
      between ( from: string, to: string ) { return c( points.filter( p => {
        const date = d( p ); return date >= from && date <= to;
      } ) ) },

      toArray () { return [ ...points ] },
      map < U > ( callback: ( item: T, index: number ) => U ) { return points.map( callback ) },

      take ( count: number ) { return c( points.slice( 0, count ) ) },
      skip ( count: number ) { return c( points.slice( count ) ) },
      slice ( start?: number, end?: number ) { return c( points.slice( start, end ) ) },

      min ( callback?: ( point: T ) => number ) { return Math.min( ...n( callback ) ) },
      max ( callback?: ( point: T ) => number ) { return Math.max( ...n( callback ) ) },

      avg ( callback?: ( point: T ) => number ) {
        const values = n( callback );
        return values.reduce( ( a, b ) => a + b, 0 ) / values.length;
      },

      median ( callback?: ( point: T ) => number ) {
        const values = n( callback ).sort( ( a, b ) => a - b );
        const mid = Math.floor( values.length / 2 );

        return values.length % 2 ? values[ mid ] : ( values[ mid - 1 ] + values[ mid ] ) / 2;
      },

      labels () { return points.map( d ) },
      values ( callback: ( point: T ) => number ) { return points.map( callback ) },
      column < K extends keyof T > ( key: K ) { return points.map( p => p[ key ] ) },

      columns () {
        const result = {} as Record< keyof T, unknown[] >;

        for ( const point of points )
          for ( const [ key, value ] of Object.entries( point as object ) )
            ( result[ key as keyof T ] ??= [] ).push( value );

        return result;
      },

      *[ Symbol.iterator ]() { yield* points }
    } );
  }

  public series () : Promise< TimeSeries< R > > {
    return this.transform( data => this.createSeries(
      data.toReversed().map( row => this.factory( row ) )
    ) );
  }
}
