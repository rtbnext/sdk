import type { Filter } from './api/Filter';
import type { List } from './api/List';
import type { Mover } from './api/Mover';
import type { Profile } from './api/Profile';
import type { Stats } from './api/Stats';
import type { System } from './api/System';


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
  expires?: number;
  etag?: string;
  lastModified?: string;
};

export interface Cache {
  readonly size: number;
  get ( key: string ) : Promise< CacheEntry | null >;
  set ( key: string, value: CacheEntry ) : Promise< void >;
  delete ( key: string ) : Promise< void >;
  clear () : Promise< void >;
}

export type CacheType = false | 'memory' | Cache;
export type CacheMode = 'ttl' | 'revalidate' | 'session';

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

export interface API {
  profile: Profile;
  list: List;
  mover: Mover;
  filter: Filter;
  stats: Stats;
  system: System;
}
