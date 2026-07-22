import { CollectableResource, Resource } from '../core/Resource';
import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import type { AnyResource, Endpoints } from '../types';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < T > ( path: string ) : Resource< T >;
  protected json < T, R > ( path: string, collect: ( data: T ) => Promise< R > | R ) : CollectableResource< T, R >;

  protected json < T, R > ( path: string, collect?: ( data: T ) => Promise< R > | R ) : AnyResource< T, R > {
    return collect
      ? new CollectableResource( path, this.loader, JsonParser.parse< T >, collect )
      : new Resource( path, this.loader, JsonParser.parse< T > );
  }

  protected csv < T > ( path: string ) : Resource< T >;
  protected csv < T, R > ( path: string, collect: ( data: T ) => Promise< R > | R ) : CollectableResource< T, R >;

  protected csv < T, R > ( path: string, collect?: ( data: T ) => Promise< R > | R ) : AnyResource< T, R > {
    return collect
      ? new CollectableResource( path, this.loader, CsvParser.parse< T >, collect )
      : new Resource< T >( path, this.loader, CsvParser.parse< T > );
  }
}
