import type { RateLimiterOptions } from '../types/core';


/**
 * RateLimiter class to limit the number of requests per time interval.
 * 
 * It supports two modes:
 *  - burst
 *  - spread
 * 
 * In burst mode, requests are processed as quickly as possible until the limit is reached.
 * In spread mode, requests are processed at a steady rate over the specified time interval.
 */
export class RateLimiter {
  /** The interval in milliseconds between each token refill. */
  private readonly refillInterval: number;
  /** Queue of pending requests waiting for tokens. */
  private readonly queue: ( () => void )[] = [];
  /** Timer for managing the spread mode. */
  private spreadTimer: NodeJS.Timeout | null = null;
  /** The current number of available tokens. */
  private tokens: number;

  /**
   * Constructs a new RateLimiter instance.
   * 
   * @param options - The configuration options for the rate limiter.
   */
  constructor ( private readonly options: RateLimiterOptions ) {
    const { maxRequests, perMs } = this.options;

    this.refillInterval = perMs / maxRequests;
    this.tokens = maxRequests;
  }

  /**
   * Processes the queued requests if there are available tokens.
   */
  private processQueue () : void {
    while ( this.tokens-- > 0 && this.queue.length ) this.queue.shift()?.();
  }

  /**
   * Handles requests in burst mode.
   * 
   * If there are available tokens, the request is processed immediately.
   * If not, the request is queued and will be processed when tokens are refilled.
   */
  public async burst () : Promise< void > {
    if ( this.tokens > 0 ) return void this.tokens--;

    return new Promise( resolve => {
      this.queue.push( resolve );

      if ( ! this.spreadTimer ) this.spreadTimer = setTimeout( () => {
        this.tokens = this.options.maxRequests, this.spreadTimer = null;
        this.processQueue();
      }, this.options.perMs );
    } );
  }

  /**
   * Handles requests in spread mode.
   * 
   * If there are available tokens, the request is processed immediately and a timer
   * is set to refill tokens at a steady rate.
   * If not, the request is queued and will be processed when tokens are refilled.
   */
  public async spread () : Promise< void > {
    if ( this.tokens > 0 ) {
      this.tokens--;

      if ( ! this.spreadTimer ) this.spreadTimer = setInterval( () => {
        if ( this.tokens < this.options.maxRequests ) {
          this.tokens++;
          this.processQueue();
        }

        if ( this.tokens === this.options.maxRequests && ! this.queue.length ) {
          this.spreadTimer && clearInterval( this.spreadTimer );
          this.spreadTimer = null;
        }
      }, this.refillInterval );

      return;
    }

    return new Promise( resolve => this.queue.push( resolve ) );
  }
}
