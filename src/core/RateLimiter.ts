import type { RateLimiterOptions } from '../types';


export class RateLimiter {
  private readonly refillInterval: number;
  private queue: ( () => void )[] = [];
  private spreadTimer: NodeJS.Timeout | null = null;
  private tokens: number;

  constructor ( private readonly options: RateLimiterOptions ) {
    this.refillInterval = this.options.perMs / this.options.maxRequests;
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

  public async spread () : Promise< void > {
    if ( this.tokens > 0 ) {
      this.tokens--;

      if ( ! this.spreadTimer ) {
        this.spreadTimer = setInterval( () => {
          if ( this.tokens < this.options.maxRequests ) {
            this.tokens++;
            this.processQueue();
          }

          if ( this.tokens === this.options.maxRequests && this.queue.length === 0 ) {
            this.spreadTimer && clearInterval( this.spreadTimer );
            this.spreadTimer = null;
          }
        }, this.refillInterval );
      }

      return;
    }

    return new Promise( resolve => this.queue.push( resolve ) );
  }
}
