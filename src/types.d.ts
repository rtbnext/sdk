export type ClientIdentity = {
  name: string;
  version: string;
  contact?: string;
  email?: string;
};

export type HttpClientOptions = {
  baseUrl: string;
  sdkVersion: string;
  client: ClientIdentity;
};

export type ApiResponse< T = unknown > = {
  data: T | null;
  url: URL;
  status: number;
  ok: boolean;
  headers: Headers;
  latency: number;
  parseError?: Error;
  format?: string;
};

export type CacheType = 'memory' | 'none' | CacheStore;

export type RTBNextOptions = {
  client: ClientIdentity;
  baseUrl?: string;
  cache?: CacheType;
};

export type CacheEntry < T = unknown > = {
  response: ApiResponse< T >;
  created: number;
};

export interface CacheStore {
  get ( key: string ) : Promise< CacheEntry | null >;
  set ( key: string, value: CacheEntry ) : Promise< void >;
  delete ( key: string ) : Promise< void >;
  clear () : Promise< void >;
}
