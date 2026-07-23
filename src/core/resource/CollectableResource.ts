import type { ParserFn } from '../../types';
import type { ResourceLoader } from '../ResourceLoader';
import { Resource } from './Resource';


export class CollectableResource< T, R > extends Resource< T > {
  constructor (
    path: string, loader: ResourceLoader, parser: ParserFn< T >,
    protected readonly collectFn: ( data: T ) => Promise< R > | R
  ) {
    super( path, loader, parser );
  }

  public collect () : Promise< R > {
    return this.transform( this.collectFn );
  }
}
