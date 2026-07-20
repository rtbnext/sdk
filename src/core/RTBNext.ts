import type { RTBNextOptions } from '../types';
import { HttpClient } from './HttpClient';


const DEFAULT_OPTIONS = {
  sdkVersion: '1.0.0',
  baseUrl: 'https://api.rtbnext.de/v2',
  httpTimeout: 5_000,
  limiter: { maxRequests: 60, perMs: 10_000 },
  cache: { type: 'memory', mode: 'ttl' }
} as const;


export class RTBNext {
  public readonly httpClient: HttpClient;

  constructor ( options: RTBNextOptions ) {
    this.httpClient = new HttpClient( {
      baseUrl: options.baseUrl ?? DEFAULT_OPTIONS.baseUrl,
      sdkVersion: DEFAULT_OPTIONS.sdkVersion,
      client: options.client,
      limiter: DEFAULT_OPTIONS.limiter,
      timeout: options.httpTimeout ?? DEFAULT_OPTIONS.httpTimeout
    } );
  }
}
