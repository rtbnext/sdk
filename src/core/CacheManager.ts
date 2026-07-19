import type { CacheMode, CacheOptions, Cache } from '../types';
import { HttpClient } from './HttpClient';
import { MemoryCache } from './MemoryCache';


export class CacheManager {
  private constructor (
    private readonly store: Cache | false,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : CacheManager {
    const { type = 'memory', mode = 'ttl' } = options;
    return new CacheManager( type === 'memory' ? new MemoryCache() : type, client, mode );
  }
}
