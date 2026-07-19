import type { RateLimiterOptions } from '../types';


export class RateLimiter {
  private queue: ( () => void )[] = [];
  private spreadTimer: NodeJS.Timeout | null = null;
  private tokens: number;

  constructor ( private readonly options: RateLimiterOptions ) {
    this.tokens = this.options.maxRequests;
  }

  private processQueue () : void {
    while ( this.tokens > 0 && this.queue.length > 0 ) {
      this.tokens--;

      const next = this.queue.shift();
      if ( next ) next();
    }
  }
}
