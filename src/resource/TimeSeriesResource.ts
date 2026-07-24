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
      items: points, total, count: points.length,

      first: points[ 0 ] ?? null,
      last: points.at( -1 ) ?? null,

      toArray () { return [ ...points ] },
      map < T > ( callback: ( item: R, index: number ) => T ) { return points.map( callback ) },

      *[ Symbol.iterator ]() { yield* points }
    } );
  }

  public series () : Promise< TimeSeries< R > > {
    return this.transform( data => this.createSeries( data.toReversed().map( this.factory ) ) );
  }
}
