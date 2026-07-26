import { EmptyCache } from '../cache/EmptyCache';
import { MemoryCache } from '../cache/MemoryCache';
import type { Cache, CacheMode, CacheOptions, HttpResponse, RequestOptions, ResourceState } from '../types/core';
import type { HttpClient } from './HttpClient';


/**
 * Loads resources with optional caching, revalidation, and cache expiration handling.
 * 
 * The ResourceLoader supports session, TTL, and revalidate cache modes, and will
 * automatically use HTTP conditional requests when previous resource state is available.
 */
export class ResourceLoader {
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

  /**
   * Creates a ResourceState from an HTTP response.
   * 
   * @param res - The HTTP response returned from the server.
   * @param prev - The previous cached resource state, if available.
   * @returns The updated ResourceState including expiration and validator headers.
   */
  private createState ( res: HttpResponse, prev?: ResourceState ) : ResourceState {
    const now = Date.now();
    const maxAge = res.headers.get( 'Cache-Control' )?.match( /max-age=(\d+)/i )?.[ 1 ];
    const expires = maxAge ? now + Number( maxAge ) * 1000 : prev?.expires;

    const etag = res.headers.get( 'ETag' ) ?? prev?.etag;
    const lastModified = res.headers.get( 'Last-Modified' ) ?? prev?.lastModified;

    const response = res.status === 304 && prev ? { ...prev.response, headers: res.headers } : res;
    return { response, created: now, expires, etag, lastModified };
  }

  /**
   * Fetches a resource from the network, optionally using conditional request headers.
   * 
   * @param path - The resource path or URL to request.
   * @param prev - Previous cache state used for revalidation.
   * @param options - Additional request options.
   * @returns The resulting resource state from the fetch operation.
   */
  private async fetch ( path: string, prev?: ResourceState, options?: RequestOptions ) : Promise< ResourceState > {
    const headers = new Headers( options?.headers );
    if ( prev?.etag ) headers.set( 'If-None-Match', prev.etag );
    if ( prev?.lastModified ) headers.set( 'If-Modified-Since', prev.lastModified );

    const res = await this.httpClient.request( path, { ...options, headers } );
    return this.createState( res, prev );
  }

  /**
   * Refreshes a cached resource by revalidating or refetching it from the network.
   * 
   * @param path - The resource path or URL to refresh.
   * @param options - Optional request-specific options.
   * @returns The refreshed ResourceState.
   */
  public async refresh ( path: string, options?: RequestOptions ) : Promise< ResourceState > {
    const cached = await this.cache.get( path );
    const state = await this.fetch( path, cached ?? undefined, options );
    await this.cache.set( path, state );

    return state;
  }

  /**
   * Determines whether a cached resource has expired.
   * 
   * @param state - The resource state to inspect.
   * @returns True when the cached state is expired, otherwise false.
   */
  private isExpired ( state: ResourceState ) : boolean {
    return !! state.expires && state.expires <= Date.now();
  }

  /**
   * Loads a resource, using cache when valid or fetching from the network as needed.
   * 
   * @param path - The resource path or URL to load.
   * @param options - Optional request-specific options.
   * @returns The loaded ResourceState.
   */
  public async load ( path: string, options?: RequestOptions ) : Promise< ResourceState > {
    if ( this.mode === 'revalidate' ) return this.refresh( path, options );

    const cached = await this.cache.get( path );
    if ( cached && ( this.mode === 'session' || ! this.isExpired( cached ) ) ) return cached;

    const state = await this.fetch( path, undefined, options );
    if ( this.mode === 'session' || state.expires ) await this.cache.set( path, state );

    return state;
  }

  /** Returns the number of entries currently stored in the cache. */
  public get size () : number {
    return this.cache.size;
  }

  /**
   * Deletes a resource entry from the cache.
   * 
   * @param path - The cache key or resource path to remove.
   */
  public async delete ( path: string ) : Promise< void > {
    await this.cache.delete( path );
  }

  /** Clears all cached resource entries. */
  public async clear () : Promise< void > {
    await this.cache.clear();
  }

  /**
   * Creates a ResourceLoader instance with the configured cache implementation.
   * 
   * @param client - The HTTP client used to perform resource requests.
   * @param options - Cache configuration options.
   * @returns A configured ResourceLoader.
   */
  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : ResourceLoader {
    const { type = 'memory', mode = 'ttl' } = options;
    const cache = type === 'memory' ? new MemoryCache() : type === false ? new EmptyCache() : type;

    return new ResourceLoader( cache, client, mode );
  }
}
