export type HttpClientOptions = {
  baseUrl: string;
  headers: Headers;
};

export type ApiResponse< T > = {};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse< unknown > > >();
  public constructor( private readonly options: HttpClientOptions ) {}
}
