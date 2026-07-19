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

    setInterval( () => this.next(), this.refillInterval );
  }

  private next () : void {
    if ( this.tokens < this.maxTokens ) {
      this.tokens++;
      this.processQueue();
    }
  }
}
