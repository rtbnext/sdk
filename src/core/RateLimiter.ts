type RateLimiterOptions = {
  maxRequests: number;
  perMs: number;
};

class RateLimiter {
  private readonly maxTokens: number;
  private readonly refillInterval: number;
  private queue: ( () => void )[] = [];
  private tokens: number;

  constructor ( private readonly options: RateLimiterOptions ) {
    this.maxTokens = options.maxRequests;
    this.refillInterval = options.perMs / options.maxRequests;
    this.tokens = options.maxRequests;

    setInterval( () => this.do(), this.refillInterval );
  }

  private do () : void {
    if ( this.tokens < this.maxTokens ) {
      this.tokens++;
      this.processQueue();
    }
  }

  private processQueue () : void {
    while ( this.tokens > 0 && this.queue.length > 0 ) {
      this.tokens--;

      const next = this.queue.shift();
      if ( next ) next();
    }
  }
}
