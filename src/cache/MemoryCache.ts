import type { Cache, ResourceState } from '../types/core';


/**
 * Basic in-memory cache implementation that stores resources in a Map.
 * 
 * This cache is suitable for short-lived applications or scenarios where persistence
 * is not required. Note that this cache does not implement any eviction policy, so it
 * may grow indefinitely if not managed properly.
 */
export class MemoryCache implements Cache {
  /** Internal Map to store cached resources. */
  private readonly cache = new Map< string, ResourceState >();

  /** Returns the number of items currently stored in the cache. */
  public get size () : number {
    return this.cache.size
  }

  /**
   * Retrieves a resource state from the cache by its key.
   * 
   * @param key - The key associated with the cached resource.
   */
  public async get ( key: string ) : Promise< ResourceState | null > {
    return this.cache.get( key ) ?? null;
  }

  /**
   * Stores a resource state in the cache with the given key.
   * If the key already exists, it will overwrite the existing value.
   * 
   * @param key - The key to associate with the cached resource.
   * @param value - The `ResourceState` to store in the cache.
   */
  public async set ( key: string, value: ResourceState ) : Promise< void > {
    this.cache.set( key, value );
  }

  /**
   * Deletes a resource state from the cache by its key.
   * 
   * @param key - The key associated with the cached resource to delete.
   */
  public async delete ( key: string ) : Promise< void > {
    this.cache.delete( key );
  }

  /** Clears all resource states from the cache. */
  public async clear () : Promise< void > {
    this.cache.clear();
  }
}
