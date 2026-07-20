import type { RequestOptions } from '../types';


export class CacheManager {
  public async request ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {}
}
