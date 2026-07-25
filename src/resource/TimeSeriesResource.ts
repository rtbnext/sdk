import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { PointFn, TimeSeriesOptions } from '../types/resource';
import { Resource } from './Resource';


export class TimeSeriesResource< D extends readonly unknown[], R extends { date: string } > extends Resource< D > {
  private readonly factory: PointFn< D, R >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: TimeSeriesOptions< D, R > ) {
    super( path, loader, parser );
    this.factory = options.point;
  }
}
