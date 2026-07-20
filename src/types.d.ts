export type ClientIdentity = {
  name: string;
  version: string;
  contact?: string;
  email?: string;
};

export type RateLimiterOptions = {
  maxRequests: number;
  perMs: number;
};

export type HttpClientOptions = {
  baseUrl: string;
  sdkVersion: string;
  client: ClientIdentity;
  limiter: RateLimiterOptions;
  timeout: number;
};

export type RequestOptions = {
  headers?: Headers;
  mode?: 'burst' | 'spread';
  timeout?: number;
};

export type HttpResponse = {
  url: URL;
  ok: boolean;
  status: number;
  body: Uint8Array< ArrayBuffer >;
  headers: Headers;
  latency: number;
};

export type ResourceState = {
  response: HttpResponse;
  created: number;
  expires?: number;
  etag?: string;
  lastModified?: string;
};

export type ParserFn< T > = ( res: HttpResponse, ...args: any[] ) => T;

export interface Cache {
  readonly size: number;
  get ( key: string ) : Promise< ResourceState | null >;
  set ( key: string, value: ResourceState ) : Promise< void >;
  delete ( key: string ) : Promise< void >;
  clear () : Promise< void >;
}

export type CacheMode = 'ttl' | 'revalidate' | 'session';
export type CacheType = false | 'memory' | Cache;

export type CacheOptions = {
  type?: CacheType;
  mode?: CacheMode;
};

export type RTBNextOptions = {
  client: ClientIdentity;
  baseUrl?: string;
  httpTimeout?: number;
  cache?: CacheOptions;
};
