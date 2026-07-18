import type { CacheStore, CacheType } from '../types';
import type { HttpClient } from './HttpClient';
import { MemoryCacheStore } from './MemoryStore';


export class CacheManager {
  public constructor (
    private readonly store: CacheStore | false,
    private readonly client: HttpClient
  ) {}

  public static fromStore ( type: CacheType, client: HttpClient ) : CacheManager {
    switch ( type ) {
      case 'none': return new CacheManager( false, client );
      case 'memory': return new CacheManager( new MemoryCacheStore(), client );
      default: return new CacheManager( type, client );
    }
  }
}
