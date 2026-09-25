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
