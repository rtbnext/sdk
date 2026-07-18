import type { RTBNextOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


const VERSION = '1.0.0' as const;
const DEFAULT_OPTIONS: Required< Omit< RTBNextOptions, 'client' > > = {
  baseUrl: 'https://api.rtbnext.de/v2',
  cache: 'memory'
} as const;

export class RTBNext {
  private readonly options: Required< RTBNextOptions >;
  private readonly httpClient: HttpClient;
  private readonly cacheManager: CacheManager;

  constructor ( options: RTBNextOptions ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.httpClient = new HttpClient( {
      baseUrl: this.options.baseUrl,
      sdkVersion: VERSION,
      client: this.options.client
    } );

    this.cacheManager = CacheManager.fromStore(
      this.options.cache,
      this.httpClient
    );
  }
}
