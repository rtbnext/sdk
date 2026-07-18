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
};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse > >();
  public constructor ( private readonly options: HttpClientOptions ) {}

  public async request < T > ( path: string, parser: ( res: Response ) => Promise< T > ) : Promise< ApiResponse< T > > {}

  public async text ( path: string ) : Promise< ApiResponse< string > > {
    return await this.request( path, res => res.text() );
  }

  public async json < T > ( path: string ) : Promise< ApiResponse< T > > {
    return await this.request( path, res => res.json() );
  }

  public async csv < T > ( path: string, delimiter: string = ';' ) : Promise< ApiResponse< T[] > > {
    return await this.request( path, async ( res ) => {
      return res.text().then( text => {
        const data: T[] = [];

        for ( const line of text.split( '\n' ) ) {
          if ( ! line.trim().length ) continue;

          const values = line.split( delimiter ).map( v => v.trim() );
          data.push( values as unknown as T );
        }

        return data;
      } );
    } );
  }
}
