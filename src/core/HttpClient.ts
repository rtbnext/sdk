import type { HttpClientOptions, HttpResponse } from '../types/core';
import { RateLimiter } from './RateLimiter';


/**
 * HTTP client with built-in rate limiting and request deduplication.
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
  public constructor ( private readonly options: HttpClientOptions ) {
    this.limiter = new RateLimiter( this.options.limiter );
    this.headers = this.createHeaders();
  }
}
