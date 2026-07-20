import type { HttpResponse, RequestOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


export class Resource< T > {
  private response?: HttpResponse;
  private value?: T;
  private parsed = false;

  constructor (
    private readonly path: string,
    private readonly client: HttpClient,
    private readonly parser: ( res: HttpResponse ) => T,
    private readonly cache: CacheManager
  ) {}

  public async load ( options?: RequestOptions ) : Promise< void > {
    if ( this.response ) throw new Error( 'Resource already loaded' );
    this.response = await this.cache.request( this.path, options );
  }
}
