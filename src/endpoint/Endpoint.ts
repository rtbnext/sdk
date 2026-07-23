import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { CollectableResource } from '../resource/CollectableResource';
import { Resource } from '../resource/Resource';
import type { AnyResource, CollectionSearchFn, Endpoints, Entity } from '../types';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < T > ( path: string ) : Resource< T >;
  protected json < T, I, E extends Entity< I > > (
    path: string, factory: ( data: T ) => E[], search: CollectionSearchFn< I >
  ) : CollectableResource< T, I, E >;

  protected json < T, I, E extends Entity< I > > (
    path: string, factory?: ( data: T ) => E[], search?: CollectionSearchFn< I >
  ) : AnyResource< T, I, E > {
    return factory && search
      ? new CollectableResource( path, this.loader, JsonParser.parse< T >, factory, search )
      : new Resource( path, this.loader, JsonParser.parse< T > );
  }

  protected csv < T > ( path: string ) : Resource< T >;
  protected csv < T, I, E extends Entity< I > > (
    path: string, factory: ( data: T ) => E[], search: CollectionSearchFn< I >
  ) : CollectableResource< T, I, E >;

  protected csv < T, I, E extends Entity< I > > (
    path: string, factory?: ( data: T ) => E[], search?: CollectionSearchFn< I >
  ) : AnyResource< T, I, E > {
    return factory && search
      ? new CollectableResource( path, this.loader, CsvParser.parse< T >, factory, search )
      : new Resource< T >( path, this.loader, CsvParser.parse< T > );
  }
}
