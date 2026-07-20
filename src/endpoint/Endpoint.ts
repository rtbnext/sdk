import { Resource } from '../core/Resource';
import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import type { ParserFn, RequestOptions } from '../types';


export abstract class Endpoint {
  constructor ( protected readonly loader: ResourceLoader ) {}

  private async resource < T > ( path: string, parser: ParserFn< T >, options?: RequestOptions ) : Promise< Resource< T > > {
    const res = new Resource< T >( path, this.loader, parser );
    await res.request( options );

    return res;
  }

  protected async text ( path: string, options?: RequestOptions ) : Promise< Resource< string > > {
    return await this.resource< string >( path, TextParser.parse, options );
  }

  protected async json < T > ( path: string, options?: RequestOptions ) : Promise< Resource< T > > {
    return await this.resource< T >( path, JsonParser.parse, options );
  }

  protected async csv < T > ( path: string, options?: RequestOptions ) : Promise< Resource< T > > {
    return await this.resource< T >( path,CsvParser.parse, options );
  }
}
