import type { RTBNextOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


export class RTBNext {
  private readonly httpClient: HttpClient;
  private readonly cacheManager: CacheManager;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout, cache } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );

    this.cacheManager = CacheManager.getInstance( this.httpClient, cache );
  }

  public get client () : HttpClient { return this.httpClient }
  public get cache () : CacheManager { return this.cacheManager }
}
