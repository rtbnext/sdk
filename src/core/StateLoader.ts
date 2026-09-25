import { EmptyCache } from '../cache/EmptyCache';
import { MemoryCache } from '../cache/MemoryCache';
import type { Cache, CacheMode, CacheOptions, HttpResponse, RequestOptions, ResourceState } from '../types/core';
import type { HttpClient } from './HttpClient';


/**
 * Loads resource states with optional caching, revalidation, and cache expiration handling.
 * 
 * The StateLoader supports session, TTL, and revalidate cache modes, and will automatically
 * use HTTP conditional requests when previous resource state is available.
 */
export class StateLoader {
  /**
   * Creates a new ResourceLoader instance.
   * 
   * @param cache - The cache implementation to store resource state.
   * @param httpClient - The HTTP client used to fetch resources.
   * @param mode - The cache mode controlling load and refresh behavior.
   */
  private constructor (
    private readonly cache: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}
}
