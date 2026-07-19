import { Profile } from '../api/Profile';
import type { Endpoints, RTBNextOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


export class RTBNext {
  private readonly httpClient: HttpClient;
  private readonly cacheManager: CacheManager;
  private readonly endpoints: Endpoints;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout, cache } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );

    this.cacheManager = CacheManager.getInstance( this.httpClient, cache );
    this.endpoints = this.loadEndpoints();
  }

  private loadEndpoints () : Endpoints {
    return {
      profile: new Profile( this.cacheManager )
    };
  }

  public get client () : HttpClient { return this.httpClient }
  public get cache () : CacheManager { return this.cacheManager }
}
