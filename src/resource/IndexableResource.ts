import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { IndexFn, IndexOptions, KeysFn } from '../types/resource';
import { Resource } from './Resource';


export class IndexableResource< D, R > extends Resource< D > {
  private readonly factory: IndexFn< R >;
  private readonly keys: KeysFn;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: IndexOptions< R > ) {
    super( path, loader, parser );
    this.factory = options.index;
    this.keys = options.keys ?? defaultKeys;
  }
}
