export type { RateLimiterOptions } from '../types/core';


/**
 * Token-based rate limiter for controlling request throughput.
 * 
 * Supports two limiting strategies:
 *  - burst: allows short request bursts up to the configured limit
 *  - spread: distributes requests evenly over the configured interval
 */
export class RateLimiter {}
