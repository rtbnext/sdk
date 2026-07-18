import type { ApiRequest, CacheEntry, CacheStore, CacheType } from '../types';
import type { HttpClient } from './HttpClient';
import { MemoryCacheStore } from './MemoryStore';


export class CacheManager {
  public constructor (
    private readonly store: CacheStore | false,
    private readonly client: HttpClient
  ) {}

  public async request < T > ( args: ApiRequest ) : Promise< CacheEntry< T > > {
    const { path, format, options } = args;

    const cached = this.store && await this.store.get( path );
    if ( cached ) return cached as CacheEntry< T >;

    const res = await this.client[ format ]( path, options?.delimiter as string );
    this.store && await this.store.set( path, res );
  }

  public static fromStore ( type: CacheType, client: HttpClient ) : CacheManager {
    switch ( type ) {
      case 'none': return new CacheManager( false, client );
      case 'memory': return new CacheManager( new MemoryCacheStore(), client );
      default: return new CacheManager( type, client );
    }
  }
}
