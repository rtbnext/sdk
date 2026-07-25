import type { HttpClientOptions, HttpResponse, RequestOptions } from '../types/core';
import { RateLimiter } from './RateLimiter';


export class HttpClient {
  private readonly limiter: RateLimiter;
  private readonly pending = new Map< string, Promise< HttpResponse > >();
  private readonly headers: Headers;

  constructor ( private readonly options: HttpClientOptions ) {
    this.limiter = new RateLimiter( this.options.limiter );
    this.headers = this.createHeaders();
  }

  private createHeaders () : Headers {
    const { client: { name, version, contact, email }, sdkVersion: v } = this.options;

    if ( ! name.trim() ) throw new Error( 'Client name is required.' );
    if ( ! version.trim() ) throw new Error( 'Client version is required.' );

    const headers = new Headers();
    const info = [ contact, email ].filter( Boolean ).join( '; ' );
    const agent = `${ name }/${ version }${ info ? ` (${ info })` : '' } @rtbnext/sdk/${ v }`;

    headers.set( 'User-Agent', `${ agent } @rtbnext/sdk/${ v }` );
    headers.set( 'X-Client-Name', name );
    headers.set( 'X-Client-Version', version );
    contact && headers.set( 'X-Client-Contact', contact );

    return headers;
  };

  private requestInit ( options?: RequestOptions ) : RequestInit {
    const headers = new Headers( this.headers );
    options?.headers?.forEach( ( v, k ) => headers.set( k, v ) );

    return { signal: AbortSignal.timeout( options?.timeout ?? this.options.timeout ), headers };
  }
}
