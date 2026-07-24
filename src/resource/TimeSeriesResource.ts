import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, TimeSeriesOptions } from '../types';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R > extends Resource< D > {
  private readonly factory: ( row: D[ number ] ) => R;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: TimeSeriesOptions< D, R > ) {
    super( path, loader, parser );

    this.factory = options.point;
  }
}
