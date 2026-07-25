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
}
