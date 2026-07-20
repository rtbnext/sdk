import { Resource } from '../core/Resource';
import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';


export abstract class Endpoint {
  constructor ( protected readonly loader: ResourceLoader ) {}

  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < T > ( path: string ) : Resource< T > {
    return new Resource< T >( path, this.loader, JsonParser.parse< T > );
  }

  protected csv < T > ( path: string ) : Resource< T > {
    return new Resource< T >( path, this.loader, CsvParser.parse< T > );
  }
}
