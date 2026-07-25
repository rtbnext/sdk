import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { AggregatePeriod, AggregatePoint, PointFn, TimeSeries, TimeSeriesOptions } from '../types/resource';
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

  private createSeries < T extends { date: string } > ( points: T[], total: number = points.length ) : TimeSeries< T > {
    const self = this;

    const c = < U extends { date: string } >( points: U[] ) => self.createSeries( points, total );
    const d = ( point: T ) => String( point.date );
    const n = ( cb?: ( point: T ) => number ) => points.map( cb ?? ( p => Number( p ) ) );

    return Object.freeze( {
      *[ Symbol.iterator ]() { yield* points },
      points, total, count: points.length,

      get first () { return points[ 0 ] ?? null },
      get last () { return points.at( -1 ) ?? null },

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
      sum ( callback?: ( point: T ) => number ) { return n( callback ).reduce( ( a, b ) => a + b, 0 ) },

      avg ( callback?: ( point: T ) => number ) {
        const values = n( callback );
        return values.reduce( ( a, b ) => a + b, 0 ) / values.length;
      },

      median ( callback?: ( point: T ) => number ) {
        const values = n( callback ).sort( ( a, b ) => a - b ), mid = Math.floor( values.length / 2 );
        return values.length % 2 ? values[ mid ] : ( values[ mid - 1 ] + values[ mid ] ) / 2;
      },

      get labels () { return points.map( d ) },
      get columns () {
        const result = {} as Record< keyof T, unknown[] >;

        for ( const point of points )
          for ( const [ key, value ] of Object.entries( point as object ) )
            ( result[ key as keyof T ] ??= [] ).push( value );

        return result;
      },

      values ( callback: ( point: T ) => number ) { return points.map( callback ) },
      column < K extends keyof T > ( key: K ) { return points.map( p => p[ key ] ) },

      aggregate ( period: AggregatePeriod | ( ( point: T ) => string ) ) {
        const groups = new Map< string, T[] >();

        for ( const point of points ) {
          const key = typeof period === 'function' ? period( point ) : self.period( point.date, period );
          ( groups.get( key ) ?? groups.set( key, [] ).get( key )! ).push( point );
        }

        return c( [ ...groups.entries() ].map( ( [ label, group ] ) => self.aggregate( group, label ) ) );
      },

      buckets ( count: number ) {
        if ( count >= points.length ) return c( points.map( ( p, i ) =>
          self.aggregate( [ p ], `${ i + 1 }/${ points.length }` )
        ) );

        const size = points.length / count;
        const result: AggregatePoint< T >[] = [];

        for ( let i = 0; i < count; i++ ) {
          const start = Math.floor( i * size ), end = Math.floor( ( i + 1 ) * size );
          result.push( self.aggregate( points.slice( start, end ), `${ i + 1 }/${ count }` ) );
        }

        return c( result );
      }
    } );
  }

  public get () : Promise< TimeSeries< R > > {
    return this.transform( data => this.createSeries(
      [ ...data ].reverse().map( row => this.factory( row ) )
    ) );
  }
}
