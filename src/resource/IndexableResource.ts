import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types';
import { Resource } from './Resource';


export class IndexableResource< T, R > extends Resource< T > {
  constructor (
    path: string, loader: ResourceLoader, parser: ParserFn< T >,
    protected readonly indexFn: ( data: T ) => Promise< R > | R
  ) {
    super( path, loader, parser );
  }

  public get () : Promise< R > {
    return this.transform( this.indexFn );
  }
}
