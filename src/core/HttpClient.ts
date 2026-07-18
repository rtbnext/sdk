export type HttpClientOptions = {
  baseUrl: string;
  headers: Headers;
};

export type ApiResponse< T > = {};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse< unknown > > >();
  public constructor( private readonly options: HttpClientOptions ) {}

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
