import type { HttpClientOptions, HttpResponse, RequestOptions } from '../types/core';
import { RateLimiter } from './RateLimiter';


/**
 * A simple HTTP client with rate limiting and request deduplication.
 * 
 * This client is designed to handle HTTP requests with built-in rate limiting and
 * deduplication of concurrent requests to the same URL.
 */
export class HttpClient {
  /** The rate limiter instance used to control request rates. */
  private readonly limiter: RateLimiter;
  /** A map to track pending requests and avoid duplicate requests to the same URL. */
  private readonly pending = new Map< string, Promise< HttpResponse > >();
  /** The default headers to include in every request. */
  private readonly headers: Headers;

  /**
   * Creates a new instance of the HttpClient.
   * 
   * @param options - The configuration options for the HTTP client.
   */
  constructor ( private readonly options: HttpClientOptions ) {
    this.limiter = new RateLimiter( this.options.limiter );
    this.headers = this.createHeaders();
  }

  /**
   * Creates the default headers for the HTTP client, including User-Agent and client information.
   * 
   * @returns A Headers object containing the default headers.
   * @throws Error if the client name or version is not provided.
   */
  private createHeaders () : Headers {
    const { client: { name, version, contact, email }, sdkVersion: v } = this.options;

    if ( ! name.trim() ) throw new Error( 'Client name is required.' );
    if ( ! version.trim() ) throw new Error( 'Client version is required.' );

    const headers = new Headers();
    const info = [ contact, email ].filter( Boolean ).join( '; ' );
    const agent = `${ name }/${ version }${ info ? ` (${ info })` : '' } @rtbnext/sdk/${ v }`;

    headers.set( 'User-Agent', `${ agent } @rtbnext/sdk/${ v }` );
    headers.set( 'X-Client-Name', name );
    headers.set( 'X-Client-Version', version );
    contact && headers.set( 'X-Client-Contact', contact );

    return headers;
  };

  /**
   * Prepares the RequestInit object for the fetch API, including headers and timeout.
   * 
   * @param options - Optional request-specific options.
   * @returns A RequestInit object for the fetch API.
   */
  private requestInit ( options?: RequestOptions ) : RequestInit {
    const headers = new Headers( this.headers );
    options?.headers?.forEach( ( v, k ) => headers.set( k, v ) );

    return { signal: AbortSignal.timeout( options?.timeout ?? this.options.timeout ), headers };
  }

  /**
   * Executes an HTTP request to the specified URL with rate limiting and returns the response.
   * 
   * @param url - The URL to send the request to.
   * @param options - Optional request-specific options.
   * @returns A promise that resolves to the HttpResponse.
   * @throws Error if the fetch operation fails.
   */
  private async execute ( url: URL, options?: RequestOptions ) : Promise< HttpResponse > {
    await this.limiter[ options?.mode ?? 'spread' ]();

    try {
      const start = performance.now();
      const res = await fetch( url, this.requestInit( options ) );
      const latency = Math.round( performance.now() - start );
      const body = new Uint8Array( await res.arrayBuffer() );

      return { url, ok: res.ok, status: res.status, body, headers: res.headers, latency };
    } catch ( err ) {
      console.error( 'Fetch error:', err );
      throw new Error( 'Fetch failed' );
    }
  }

  /**
   * Sends an HTTP request to the specified path, using the base URL from the client options.
   * 
   * If a request to the same URL is already pending, it will return the existing promise
   * instead of creating a new request.
   * 
   * @param path - The path to send the request to, relative to the base URL.
   * @param options - Optional request-specific options.
   * @returns A promise that resolves to the HttpResponse.
   */
  public async request ( path: string, options?: RequestOptions ) : Promise< HttpResponse > {
    const url = new URL( path, this.options.baseUrl ), key = url.href;

    const existing = this.pending.get( key );
    if ( existing ) return existing;

    const request = this.execute( url, options );
    this.pending.set( key, request );

    try { return await request }
    finally { this.pending.delete( key ) }
  }
}
