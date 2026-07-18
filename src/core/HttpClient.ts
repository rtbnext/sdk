export type HttpClientOptions = {
  baseUrl: string;
  headers: Headers;
};

export type ApiResponse< T > = {
  data: T | null;
  url: URL;
  status: number;
  ok: boolean;
  headers: Headers;
  latency: number;
};


export class HttpClient {
  private readonly pending = new Map< string, Promise< ApiResponse< unknown > > >();
  public constructor ( private readonly options: HttpClientOptions ) {}

  
}
