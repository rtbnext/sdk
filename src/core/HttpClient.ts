export type HttpClientOptions = {
  baseUrl: string;
  headers: Headers;
};

export type ApiResponse< T > = {
  data: T;
  url: URL;
  status: number;
  headers: Headers;
  latency: number;
};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse< unknown > > >();
  public constructor( private readonly options: HttpClientOptions ) {}

  private async execute < T > ( url: URL ) : Promise< ApiResponse< T > > {
    const start = performance.now();
    const response = await fetch( url, { method: 'GET', headers: this.options.headers } );
    const latency = performance.now() - start;

    const data = await response.json() as T;
    return { data, url, status: response.status, headers: response.headers, latency };
  }

  public async request < T > ( path: string ) : Promise< ApiResponse< T > > {
    const url = new URL( path, this.options.baseUrl );
    const key = url.href;

    const existing = this.pending.get( key );
    if ( existing ) return existing as Promise< ApiResponse< T > >;

    const request = this.execute< T >( url );
    this.pending.set( key, request );

    try { return await request }
    finally { this.pending.delete( key ) }
  }
}
