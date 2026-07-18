import { Parser } from './Parser';
import type { ApiResponse, HttpClientOptions } from './types';


export class HttpClient {
  private readonly options: HttpClientOptions;
  private readonly pending = new Map< string, Promise< ApiResponse > >();

  public constructor ( options: HttpClientOptions ) {
    this.options = { ...options, headers: new Headers( options.headers ) };
  }

  private async execute < T > ( url: URL, parser: ( res: Response ) => Promise< T > ) : Promise< ApiResponse< T > > {
    const start = performance.now();
    const res = await fetch( url, { method: 'GET', headers: this.options.headers } );
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
      return res.text().then( raw => Parser.jsonl( raw ) );
    } ), format: 'jsonl' };
  }

  public async blob ( path: string ) : Promise< ApiResponse< Blob > > {
    return { ...await this.request( path, res => res.blob() ), format: 'blob' };
  }

  public async csv < T > ( path: string, delimiter: string = ';' ) : Promise< ApiResponse< T[] > > {
    return { ...await this.request( path, async ( res ) => {
      return res.text().then( raw => Parser.csv( raw, delimiter ) );
    } ), format: 'csv' };
  }
}
