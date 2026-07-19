import type { HttpClientOptions, HttpResponse, RequestOptions } from '../types';
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
    const { client, sdkVersion } = this.options;

    if ( ! client.name.trim() ) throw new Error( 'Client name is required.' );
    if ( ! client.version.trim() ) throw new Error( 'Client version is required.' );

    const headers = new Headers();
    let userAgent = `${ client.name }/${ client.version }`;

    const contact = [ client.contact, client.email ].filter( Boolean ).join( '; ' );
    if ( contact.length ) userAgent += ` (${ contact })`;

    headers.set( 'User-Agent', `${ userAgent } @rtbnext/sdk/${ sdkVersion }` );
    headers.set( 'X-Client-Name', client.name );
    headers.set( 'X-Client-Version', client.version );

    if ( client.contact ) headers.set( 'X-Client-Contact', client.contact );

    return headers;
  };

  private requestInit ( options?: RequestOptions ) : RequestInit {
    return {
      signal: AbortSignal.timeout( options?.timeout ?? this.options.timeout ),
      headers: new Headers( { ...this.headers, ...options?.headers } )
    };
  }

  private async execute ( url: URL, options?: RequestOptions ) : Promise< HttpResponse > {
    await this.limiter.acquire();

    const start = performance.now();
    const res = await fetch( url, this.requestInit( options ) );
    const latency = Math.round( performance.now() - start );
    const body = new Uint8Array( await res.arrayBuffer() );

    return { url, ok: res.ok, status: res.status, body, headers: res.headers, latency };
  }

  public async request ( path: string, options?: RequestOptions ) : Promise< HttpResponse > {
    const url = new URL( path, this.options.baseUrl );
    const key = url.href;

    const existing = this.pending.get( key );
    if ( existing ) return existing;

    const request = this.execute( url, options );
    this.pending.set( key, request );

    try { return await request }
    finally { this.pending.delete( key ) }
  }
}
