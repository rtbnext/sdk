import type { HttpClientOptions, HttpResponse } from '../types/core';
import { RateLimiter } from './RateLimiter';


export class HttpClient {
  private readonly limiter: RateLimiter;
  private readonly pending = new Map< string, Promise< HttpResponse > >();
  private readonly headers: Headers;

  constructor ( private readonly options: HttpClientOptions ) {
    this.limiter = new RateLimiter( this.options.limiter );
    this.headers = this.createHeaders();
  }
}
