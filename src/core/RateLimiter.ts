export class RateLimiter {
  private readonly refillInterval: number;
  private readonly queue: ( () => void )[] = [];
  private spreadTimer: NodeJS.Timeout | null = null;
  private tokens: number;
}
