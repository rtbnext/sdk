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
}
