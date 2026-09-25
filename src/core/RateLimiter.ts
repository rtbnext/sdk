export type { RateLimiterOptions } from '../types/core';


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
}
