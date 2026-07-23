import { collection } from '../core/Collection';
import type { ResourceLoader } from '../core/ResourceLoader';
import type { Collection, CollectionSearchFn, Entity, ParserFn } from '../types';
import { Resource } from './Resource';


export class CollectableResource< T, I, E extends Entity< I > > extends Resource< T > {
  constructor (
    path: string, loader: ResourceLoader, parser: ParserFn< T >,
    private readonly factory: ( data: T ) => E[],
    protected readonly search: CollectionSearchFn< I >
  ) {
    super( path, loader, parser );
  }

  public collect () : Promise< Collection< I > > {
    return this.transform( data => collection( this.factory( data ), this.search ) );
  }
}
