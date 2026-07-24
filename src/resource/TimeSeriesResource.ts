import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, TimeSeries, TimeSeriesOptions } from '../types';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R extends { date: string } > extends Resource< D > {
  private readonly factory: ( row: D[ number ] ) => R;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: TimeSeriesOptions< D, R > ) {
    super( path, loader, parser );

    this.factory = options.point;
  }

  private createSeries ( points: R[], total: number = points.length ) : TimeSeries< R > {
    const c = ( points: R[] ) => this.createSeries( points );
    const d = ( point: R ) => String( point.date );
    const n = ( cb?: ( point: R ) => number ) => points.map( cb ?? ( p => Number( p ) ) );

    return Object.freeze( {
      points, total, count: points.length,

      first: points[ 0 ] ?? null,
      last: points.at( -1 ) ?? null,

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
      map < T > ( callback: ( item: R, index: number ) => T ) { return points.map( callback ) },

      take ( count: number ) { return c( points.slice( 0, count ) ) },
      skip ( count: number ) { return c( points.slice( count ) ) },
      slice ( start?: number, end?: number ) { return c( points.slice( start, end ) ) },

      min ( callback?: ( point: R ) => number ) { return Math.min( ...n( callback ) ) },
      max ( callback?: ( point: R ) => number ) { return Math.max( ...n( callback ) ) },

      avg ( callback?: ( point: R ) => number ) {
        const values = n( callback );
        return values.reduce( ( a, b ) => a + b, 0 ) / values.length;
      },

      median ( callback?: ( point: R ) => number ) {
        const values = n( callback ).sort( ( a, b ) => a - b );
        const mid = Math.floor( values.length / 2 );

        return values.length % 2 ? values[ mid ] : ( values[ mid - 1 ] + values[ mid ] ) / 2;
      },

      *[ Symbol.iterator ]() { yield* points }
    } );
  }

  public series () : Promise< TimeSeries< R > > {
    return this.transform( data => this.createSeries( data.toReversed().map( this.factory ) ) );
  }
}
