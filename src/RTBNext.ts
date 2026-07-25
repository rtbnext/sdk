import { HttpClient } from './core/HttpClient';
import { ResourceLoader } from './core/ResourceLoader';
import type { RTBNextOptions } from './types/core';


const DEFAULT_OPTIONS = {
  sdkVersion: '1.0.0',
  baseUrl: 'https://api.rtbnext.de',
  httpTimeout: 5_000,
  limiter: { maxRequests: 60, perMs: 10_000 },
  cache: { type: 'memory', mode: 'ttl' }
} as const;


export class RTBNext {
  public readonly httpClient: HttpClient;
  public readonly resourceLoader: ResourceLoader;

  constructor ( options: RTBNextOptions ) {
    this.httpClient = new HttpClient( {
      baseUrl: options.baseUrl ?? DEFAULT_OPTIONS.baseUrl,
      sdkVersion: DEFAULT_OPTIONS.sdkVersion,
      client: options.client,
      limiter: DEFAULT_OPTIONS.limiter,
      timeout: options.httpTimeout ?? DEFAULT_OPTIONS.httpTimeout
    } );

    this.resourceLoader = ResourceLoader.getInstance( this.httpClient, {
      ...DEFAULT_OPTIONS.cache, ...options.cache
    } );
  }
}
