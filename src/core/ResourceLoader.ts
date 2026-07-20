import { Cache, CacheMode, CacheOptions } from '../types';
import { EmptyCache } from './EmptyCache';
import { HttpClient } from './HttpClient';
import { MemoryCache } from './MemoryCache';


export class ResourceLoader {
  private constructor (
    private readonly cache: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  public get size () : number {
    return this.cache.size;
  }

  public async delete ( path: string ) : Promise< void > {
    this.cache.delete( path );
  }

  public async clear () : Promise< void > {
    this.cache.clear();
  }

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : ResourceLoader {
    const { type = 'memory', mode = 'ttl' } = options;
    const cache = type === 'memory' ? new MemoryCache() : type === false ? new EmptyCache() : type;

    return new ResourceLoader( cache, client, mode );
  }
}
