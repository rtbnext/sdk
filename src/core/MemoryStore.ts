import { CacheEntry, CacheStore } from '../types';


export class MemoryCacheStore implements CacheStore {
  private readonly cache = new Map< string, CacheEntry >();

  public async get ( key: string ) : Promise< CacheEntry | null > {
    return this.cache.get( key ) ?? null;
  }

  public async set ( key: string, value: CacheEntry ) : Promise< void > {
    this.cache.set( key, value );
  }

  public async delete ( key: string ) : Promise< void > {
    this.cache.delete( key );
  }

  public async clear () : Promise< void > {
    this.cache.clear();
  }
}
