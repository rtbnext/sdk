import type { Cache, CacheEntry, CacheMode, CacheOptions, RequestOptions } from '../types';
import { HttpClient } from './HttpClient';
import { MemoryCache } from './MemoryCache';


export class CacheManager {
  private constructor (
    private readonly store: Cache | false,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  public async request ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {
    const cached = this.store && await this.store.get( path );
    if ( cached ) return cached;

    const res = await this.httpClient.request( path, options );
    const entry = { response: res, created: new Date().getTime() };

    this.store && await this.store.set( path, entry );
    return entry;
  }

  public async clear () : Promise< void > {
    this.store && await this.store.clear();
  }

  public async delete ( path: string ) : Promise< void > {
    this.store && await this.store.delete( path );
  }

  public get size () : number {
    return this.store ? this.store.size : 0;
  }

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : CacheManager {
    const { type = 'memory', mode = 'ttl' } = options;
    return new CacheManager( type === 'memory' ? new MemoryCache() : type, client, mode );
  }
}
