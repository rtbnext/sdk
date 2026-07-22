import { CollectableResource, Resource } from '../core/Resource';
import type { ResourceLoader } from '../core/ResourceLoader';
import { collection, profileEntity } from '../core/utils';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import type { AnyResource, Collection, CollectionSearchFn, Endpoints } from '../types';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected json < T > ( path: string ) : Resource< T >;
  protected json < T, R > ( path: string, collect: ( data: T ) => Promise< R > | R ) : CollectableResource< T, R >;

  protected json < T, R > ( path: string, collect?: ( data: T ) => Promise< R > | R ) : AnyResource< T, R > {
    return collect
      ? new CollectableResource( path, this.loader, JsonParser.parse< T >, collect )
      : new Resource( path, this.loader, JsonParser.parse< T > );
  }
}
