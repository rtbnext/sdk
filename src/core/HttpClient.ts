import { DEFAULT_OPTIONS } from '../defaults';
import type { HttpClientOptions, HttpResponse } from '../types/core';
import { RateLimiter } from './RateLimiter';


/**
 * HTTP client with built-in rate limiting and request deduplication.
 * 
 * This client is designed to handle HTTP requests with built-in rate limiting and
 * deduplication of concurrent requests to the same URL.
 */
export class HttpClient {
  /** The configuration options for the HTTP client. */
  private readonly options: Required< HttpClientOptions >;
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
  public constructor ( options: HttpClientOptions ) {
    this.options = { ...DEFAULT_OPTIONS.client, ...options };
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
    const { sdkVersion: v } = DEFAULT_OPTIONS;
    const { client: { name, version, contact, email } } = this.options;

    if ( ! String( name ).trim() ) throw new Error( 'Client name is required.' );
    if ( ! version.trim() ) throw new Error( 'Client version is required.' );

    const headers = new Headers();
    const info = [ contact, email ].filter( Boolean ).join( '; ' );
    const agent = `${ name }/${ version }${ info ? ` (${ info })` : '' } @rtbnext/sdk/${ v }`;

    headers.set( 'User-Agent', agent );
    headers.set( 'X-Client-Name', name );
    headers.set( 'X-Client-Version', version );
    contact && headers.set( 'X-Client-Contact', contact );

    return headers;
  };
}
