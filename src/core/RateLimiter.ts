type RateLimiterOptions = {
  maxRequests: number;
  perMs: number;
};

class RateLimiter {
  private readonly maxTokens: number;
  private readonly refillInterval: number;
  private queue: ( () => void )[] = [];
  private tokens: number;

  constructor ( { maxRequests, perMs }: RateLimiterOptions ) {
    this.maxTokens = maxRequests;
    this.refillInterval = perMs / maxRequests;
    this.tokens = maxRequests;

    setInterval( () => this.do(), this.refillInterval );
  }

  private do () : void {
    if ( this.tokens < this.maxTokens ) this.tokens++, this.processQueue();
  }

  private processQueue () : void {
    while ( this.tokens > 0 && this.queue.length > 0 ) {
      this.tokens--;

      const next = this.queue.shift();
      if ( next ) next();
    }
  }

  public async acquire () : Promise< void > {
    if ( this.tokens > 0 ) { this.tokens--; return }
    return new Promise( resolve => this.queue.push( resolve ) );
  }
}
