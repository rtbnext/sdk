import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { Resource } from '../resource/Resource';
import type { Endpoints } from '../types/endpoint';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < D > ( path: string ) : Resource< D > {
    return new Resource< D >( path, this.loader, JsonParser.parse );
  }

  protected csv < D > ( path: string ) : Resource< D > {
    return new Resource< D >( path, this.loader, CsvParser.parse );
  }
}
