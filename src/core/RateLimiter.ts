import type { RateLimiterOptions } from '../types/core';


export class RateLimiter {
  private readonly refillInterval: number;
  private readonly queue: ( () => void )[] = [];
  private spreadTimer: NodeJS.Timeout | null = null;
  private tokens: number;

  constructor ( private readonly options: RateLimiterOptions ) {
    const { maxRequests, perMs } = this.options;

    this.refillInterval = perMs / maxRequests;
    this.tokens = maxRequests;
  }
}
