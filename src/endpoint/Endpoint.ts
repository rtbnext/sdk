import type { CacheManager } from '../core/CacheManager';
import { JsonParser } from '../parser/JsonParser';
import type { ApiResponse, RequestOptions } from '../types';


export abstract class Endpoint {
  constructor ( protected readonly cache: CacheManager ) {}

  protected async json < T > ( path: string, options?: RequestOptions ) : Promise< ApiResponse< T > > {
    const res = await this.cache.request( path, options );
    const data = () => res.response.ok ? JsonParser.parse< T >( res.response.body ) : null

    return { ...res, data };
  }
}
