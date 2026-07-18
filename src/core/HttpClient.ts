export type HttpClientOptions = {
  baseUrl: string;
  headers: Headers;
};

export type ApiResponse< T = unknown > = {
  data: T | null;
  url: URL;
  status: number;
  ok: boolean;
  headers: Headers;
  latency: number;
  parseError?: unknown;
  format?: string;
};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse > >();
  public constructor ( private readonly options: HttpClientOptions ) {}

  private async execute < T > ( url: URL, parser: ( res: Response ) => Promise< T > ) : Promise< ApiResponse< T > > {
    const start = performance.now();
    const res = await fetch( url, { method: 'GET', headers: new Headers( this.options.headers ) } );
    const latency = Math.round( performance.now() - start );

    let data: T | null = null, parseError;
    if ( res.ok ) try { data = await parser( res ) as T } catch ( e ) { parseError = e }

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
      return res.text().then( text => {
        const data: T[] = [];

        for ( const line of text.split( '\n' ) ) {
          if ( ! line.trim().length ) continue;
          try { data.push( JSON.parse( line ) as T ) } catch {}
        }

        return data;
      } );
    } ), format: 'jsonl' };
  }

  public async blob ( path: string ) : Promise< ApiResponse< Blob > > {
    return { ...await this.request( path, res => res.blob() ), format: 'blob' };
  }

  public async csv < T > ( path: string, delimiter: string = ';' ) : Promise< ApiResponse< T[] > > {
    return { ...await this.request( path, async ( res ) => {
      return res.text().then( text => {
        const data: T[] = [];

        for ( const line of text.split( '\n' ) ) {
          if ( ! line.trim().length ) continue;

          data.push( line.split( delimiter ).map( v => {
            const n = Number( v );
            return Number.isNaN( n ) ? v.trim() : n;
          } ) as unknown as T );
        }

        return data;
      } );
    } ), format: 'csv' };
  }
}
