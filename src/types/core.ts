// --- client identity ---

/** Information, used to identify the client in requests. */
export interface ClientIdentity {
  /** The name of the client, e.g. `my-app`. */
  name: string;
  /** The version of the client, e.g. `1.0.0`. */
  version: string;
  /** Optional contact information for the client, e.g. `https://example.com/contact`. */
  contact?: string;
  /** Optional email address for the client. */
  email?: string;
}

// ---- rate limiter ---

/** Options for the rate limiter. */
export interface RateLimiterOptions {
  /** The maximum number of requests allowed in the given time window. */
  maxRequests: number;
  /** The time window in milliseconds for the rate limiter. */
  perMs: number;
}

// --- http client ---

/** Options for the HTTP client. */
export interface HttpClientOptions {
  /** The base URL for the API. */
  baseUrl: string;
  /** The version of the SDK. */
  sdkVersion: string;
  /** The identity of the client making requests. */
  client: ClientIdentity;
  /** The rate limiter options. */
  limiter: RateLimiterOptions;
  /** The default timeout for requests in milliseconds. */
  timeout: number;
}

/** Options for individual HTTP requests. */
export interface RequestOptions {
  /** Optional headers to include in the request. */
  headers?: Headers;
  /** The rate limiting mode, either 'burst' or 'spread'. */
  mode?: 'burst' | 'spread';
  /** Optional timeout for the request in milliseconds. */
  timeout?: number;
}

/** The response from an HTTP request. */
export interface HttpResponse {
  /** The URL of the request. */
  url: URL;
  /** Whether the request was successful (status code 2xx). */
  ok: boolean;
  /** The HTTP status code of the response. */
  status: number;
  /** The body of the response as a Uint8Array. */
  body: Uint8Array< ArrayBuffer >;
  /** The headers of the response. */
  headers: Headers;
  /** The latency of the request in milliseconds. */
  latency: number;
}

// --- resource loader ---

/** The state of a cached resource. */
export interface ResourceState {
  /** The HTTP response associated with the resource. */
  response: HttpResponse;
  /** The timestamp when the resource was created in the cache. */
  created: number;
  /** The timestamp when the resource expires in the cache, if applicable. */
  expires?: number;
  /** The ETag of the resource, if applicable. */
  etag?: string;
  /** The Last-Modified header of the resource, if applicable. */
  lastModified?: string;
}

// --- cache ---

/** The interface for a cache implementation. */
export interface Cache {
  /** The number of items currently stored in the cache. */
  readonly size: number;
  /** Retrieves a resource state from the cache by its key. */
  get ( key: string ) : Promise< ResourceState | null >;
  /** Stores a resource state in the cache with the given key. */
  set ( key: string, value: ResourceState ) : Promise< void >;
  /** Deletes a resource state from the cache by its key. */
  delete ( key: string ) : Promise< void >;
  /** Clears all resource states from the cache. */
  clear () : Promise< void >;
}

/**
 * The mode of caching to use when loading resources.
 * 
 *  - 'ttl': Use the cached resource if it exists and is not expired.
 *  - 'revalidate': Always fetch the resource from the server and update the cache.
 *  - 'session': Use the cached resource if it exists, regardless of expiration.
 */
export type CacheMode = 'ttl' | 'revalidate' | 'session';

/**
 * The type of cache to use, either false (no cache), 'memory' (in-memory cache),
 * or a custom cache implementation.
 */
export type CacheType = false | 'memory' | Cache;

/** Options for configuring the cache behavior. */
export interface CacheOptions {
  /** The type of cache to use. */
  type?: CacheType;
  /** The mode of caching to use. */
  mode?: CacheMode;
}

// --- parser ---

/** A function that parses an HTTP response into a specific data type. */
export type ParserFn< D > = ( res: HttpResponse ) => D;

// --- RTBNext options ---

/** Options for configuring the RTBNext SDK. */
export interface RTBNextOptions {
  /** The identity of the client using the SDK. */
  client: ClientIdentity;
  /** The base URL for the API. */
  baseUrl?: string;
  /** The default timeout for HTTP requests in milliseconds. */
  httpTimeout?: number;
  /** The cache configuration options. */
  cache?: CacheOptions;
}
