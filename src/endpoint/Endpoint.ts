import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { CollectableResource } from '../resource/CollectableResource';
import { Resource } from '../resource/Resource';
import type { CollectionSearchFn, Endpoints, Entity } from '../types';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected text ( path: string ) {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < D > ( path: string ) : Resource< D >;
  protected json < D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > (
    path: string, entity: ( data: I ) => E, search: CollectionSearchFn< I >
  ) : CollectableResource< D, I, E >;

  protected json < I extends { uri: string }, D extends { items: I[] }, E extends Entity< I > > (
    path: string, entity?: ( data: I ) => E, search?: CollectionSearchFn< I >
  ) {
    return entity && search
      ? new CollectableResource( path, this.loader, JsonParser.parse< D >, entity, search )
      : new Resource( path, this.loader, JsonParser.parse< D > );
  }

  protected csv < D > ( path: string ) : Resource< D >;
  protected csv < D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > (
    path: string, entity: ( data: I ) => E, search: CollectionSearchFn< I >
  ) : CollectableResource< D, I, E >;

  protected csv < D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > (
    path: string, entity?: ( data: I ) => E, search?: CollectionSearchFn< I >
  ) {
    return entity && search
      ? new CollectableResource( path, this.loader, CsvParser.parse< D >, entity, search )
      : new Resource< D >( path, this.loader, CsvParser.parse< D > );
  }
}
