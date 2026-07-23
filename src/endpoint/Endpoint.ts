import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { CollectableResource } from '../resource/CollectableResource';
import { IndexableResource } from '../resource/IndexableResource';
import { Resource } from '../resource/Resource';
import type { CollectOptions, Endpoints, Entity, IndexOptions, ResourceOptions } from '../types';


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
    path: string, options: CollectOptions< I, E >
  ) : CollectableResource< D, I, E >;
  protected json < D, R > ( path: string, options: IndexOptions< R > ) : IndexableResource< D, R >;

  protected json ( path: string, options?: ResourceOptions< any, any, any > ) {
    if ( ! options ) return new Resource( path, this.loader, JsonParser.parse );
    if ( 'entity' in options ) return new CollectableResource( path, this.loader, JsonParser.parse, options );
    return new IndexableResource( path, this.loader, JsonParser.parse, options );
  }

  protected csv < D > ( path: string ) : Resource< D >;
  protected csv < D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > (
    path: string, options: CollectOptions< I, E >
  ) : CollectableResource< D, I, E >;
  protected csv < D, R > ( path: string, options: IndexOptions< R > ) : IndexableResource< D, R >;

  protected csv ( path: string, options?: ResourceOptions< any, any, any > ) {
    if ( ! options ) return new Resource( path, this.loader, CsvParser.parse );
    if ( 'entity' in options ) return new CollectableResource( path, this.loader, CsvParser.parse, options );
    return new IndexableResource( path, this.loader, CsvParser.parse, options );
  }
}
