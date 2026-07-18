import { CsvParser, JsonlParser } from './Parser';
import type { ApiResponse, HttpClientOptions } from './types';


export class HttpClient {
  private readonly options: HttpClientOptions;
  private readonly headers: Headers;
  private readonly pending = new Map< string, Promise< ApiResponse > >();

  public constructor ( options: HttpClientOptions ) {
    this.options = options;
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

  private async execute < T > ( url: URL, parser: ( res: Response ) => Promise< T > ) : Promise< ApiResponse< T > > {
    const start = performance.now();
    const res = await fetch( url, { method: 'GET', headers: this.headers } );
    const latency = Math.round( performance.now() - start );

    let data: T | null = null, parseError;
    if ( res.ok ) try { data = await parser( res ) as T } catch ( e ) {
      parseError = e instanceof Error ? e : new Error( String( e ) );
    }

    return { data, url, status: res.status, ok: res.ok, headers: res.headers, latency, parseError };
  }

  private async request < T > ( path: string, parser: ( res: Response ) => Promise< T > ) : Promise< ApiResponse< T > > {
    const url = new URL( path, this.options.baseUrl );
    const key = url.href;

    const existing = this.pending.get( key );
    if ( existing ) return existing as Promise< ApiResponse< T > >;

    const request = this.execute< T >( url, parser );
    this.pending.set( key, request );

    try { return await request }
    finally { this.pending.delete( key ) }
  }

  public async text ( path: string ) : Promise< ApiResponse< string > > {
    return { ...await this.request( path, res => res.text() ), format: 'text' };
  }

  public async json < T > ( path: string ) : Promise< ApiResponse< T > > {
    return { ...await this.request( path, res => res.json() ), format: 'json' };
  }

  public async jsonl < T > ( path: string ) : Promise< ApiResponse< T[] > > {
    return { ...await this.request( path, async ( res ) => {
      return res.text().then( raw => JsonlParser.parse( raw ) );
    } ), format: 'jsonl' };
  }

  public async blob ( path: string ) : Promise< ApiResponse< Blob > > {
    return { ...await this.request( path, res => res.blob() ), format: 'blob' };
  }

  public async csv < T > ( path: string, delimiter: string = ';' ) : Promise< ApiResponse< T[] > > {
    return { ...await this.request( path, async ( res ) => {
      return res.text().then( raw => CsvParser.parse( raw, delimiter ) );
    } ), format: 'csv' };
  }
}
