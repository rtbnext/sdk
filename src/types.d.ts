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

export type CacheEntry = {
  response: HttpResponse;
  created: number;
}

export interface CacheStore {
  readonly size: number;
  get ( key: string ) : Promise< CacheEntry | null >;
  set ( key: string, value: CacheEntry ) : Promise< void >;
  delete ( key: string ) : Promise< void >;
  clear () : Promise< void >;
}

export type CacheType = false | 'memory' | CacheStore;
export type CacheMode = 'ttl' | 'revalidate' | 'once' | 'none';

export type CacheOptions = {
  type?: CacheType;
  mode?: CacheMode;
}
