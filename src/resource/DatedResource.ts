import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { DateFn, DateOptions } from '../types/resource';
import { Resource } from './Resource';


export class DateableResource< D extends { dates: string[] }, R > extends Resource< D > {
  private readonly factory: DateFn< R >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: DateOptions< R > ) {
    super( path, loader, parser );
    this.factory = options.date;
  }
}
