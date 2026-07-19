import type { CacheManager } from '../core/CacheManager';
import { JsonParser } from '../core/JsonParser';
import type { ApiResponse, RequestOptions } from '../types';


export abstract class API {
  constructor ( protected readonly cache: CacheManager ) {}

  protected async json < T > ( path: string, options?: RequestOptions ) : Promise< ApiResponse< T > > {
    const res = await this.cache.request( path, options );
    return { response: res, data: () => res.response.ok ? JsonParser.parse( res.response.body ) : null };
  }
}
