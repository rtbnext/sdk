import { Resource } from '../core/Resource';
import type { ResourceLoader } from '../core/ResourceLoader';
import { JsonParser } from '../parser/JsonParser';
import type { RequestOptions } from '../types';


export abstract class Endpoint {
  constructor ( protected readonly loader: ResourceLoader ) {}

  protected async json < T > ( path: string, options?: RequestOptions ) : Promise< Resource< T > > {
    const res = new Resource< T >( path, this.loader, JsonParser.parse );
    await res.request( options );

    return res;
  }
}
