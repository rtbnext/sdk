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

  public async burst () : Promise< void > {
    if ( this.tokens > 0 ) { this.tokens--; return }

    return new Promise( resolve => {
      this.queue.push( resolve );

      if ( ! this.spreadTimer ) this.spreadTimer = setTimeout( () => {
        this.tokens = this.options.maxRequests;
        this.spreadTimer = null;

        this.processQueue();
      }, this.options.perMs );
    } );
  }
}
