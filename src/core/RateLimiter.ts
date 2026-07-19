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

    setInterval( () => this.refill(), this.refillInterval );
  }
}
