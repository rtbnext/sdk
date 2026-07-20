import type { RTBNextOptions } from '../types';
import { HttpClient } from './HttpClient';


export class RTBNext {
  public readonly httpClient: HttpClient;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );
  }
}
