// ---- rate limiter ---

/** Options for the rate limiter. */
export interface RateLimiterOptions {
  /** The maximum number of requests allowed in the given time window. */
  maxRequests: number;
  /** The time window in milliseconds for the rate limiter. */
  perMs: number;
}
