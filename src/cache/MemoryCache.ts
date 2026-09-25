import type { Cache, ResourceState } from '../types/core';


/**
 * Simple in-memory cache backed by a Map.
 * 
 * Suitable for short-lived applications where persistence is not required.
 * No eviction strategy is implemented, so cached entries remain until they
 * are explicitly removed or the cache is cleared.
 */
export class MemoryCache implements Cache {
  /** Internal Map to store cached resources. */
  private readonly store = new Map< string, ResourceState >();

  /** Returns the number of items currently stored in the cache. */
  public get size () : number {
    return this.store.size
  }

  /**
   * Retrieves a resource state from the cache by its key.
   * 
   * @param key - The key associated with the cached resource.
   */
  public async get ( key: string ) : Promise< ResourceState | null > {
    return this.store.get( key ) ?? null;
  }

  /**
   * Stores a resource state in the cache with the given key.
   * If the key already exists, it will overwrite the existing value.
   * 
   * @param key - The key to associate with the cached resource.
   * @param value - The `ResourceState` to store in the cache.
   */
  public async set ( key: string, value: ResourceState ) : Promise< void > {
    this.store.set( key, value );
  }

  /**
   * Deletes a resource state from the cache by its key.
   * 
   * @param key - The key associated with the cached resource to delete.
   */
  public async delete ( key: string ) : Promise< void > {
    this.store.delete( key );
  }

  /** Clears all resource states from the cache. */
  public async clear () : Promise< void > {
    this.store.clear();
  }
}
