import type { RateLimiterOptions } from '../types/core';


/**
 * Token-based rate limiter for controlling request throughput.
 * 
 * Supports two limiting strategies:
 *  - burst: allows short request bursts up to the configured limit
 *  - spread: distributes requests evenly over the configured interval
 */
export class RateLimiter {
  /** The interval in milliseconds between each token refill. */
  private readonly refillInterval: number;
  /** Queue of pending requests waiting for tokens. */
  private readonly queue: ( () => void )[] = [];
  /** Active timer used to replenish tokens. */
  private timer: NodeJS.Timeout | null = null;
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

  /** Processes the queued requests if there are available tokens. */
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

      if ( ! this.timer ) this.timer = setTimeout( () => {
        this.tokens = this.options.maxRequests;
        this.timer = null;

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

      if ( ! this.timer ) this.timer = setInterval( () => {
        if ( this.tokens < this.options.maxRequests ) {
          this.tokens++;
          this.processQueue();
        }

        if ( this.tokens === this.options.maxRequests && ! this.queue.length ) {
          this.timer && clearInterval( this.timer );
          this.timer = null;
        }
      }, this.refillInterval );

      return;
    }

    return new Promise( resolve => this.queue.push( resolve ) );
  }
}
