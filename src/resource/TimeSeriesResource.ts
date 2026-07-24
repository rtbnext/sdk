import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, TimeSeries, TimeSeriesOptions } from '../types';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R > extends Resource< D > {
  private readonly factory: ( row: D[ number ] ) => R;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: TimeSeriesOptions< D, R > ) {
    super( path, loader, parser );

    this.factory = options.point;
  }

  private createSeries ( rows: D, total: number = rows.length ) : TimeSeries< R > {
    const points = rows.toReversed().map( this.factory );

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
    return this.transform( data => this.createSeries( data ) );
  }
}
