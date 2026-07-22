import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Resource } from './core/Resource';
import type { Filter } from './endpoint/Filter';
import type { List } from './endpoint/List';
import type { Mover } from './endpoint/Mover';
import type { Profile } from './endpoint/Profile';
import type { Stats } from './endpoint/Stats';
import type { System } from './endpoint/System';


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

export interface Endpoints {
  profile: Profile;
  list: List;
  mover: Mover;
  filter: Filter;
  stats: Stats;
  system: System;
}

export interface ProfileResources {
  readonly meta: Resource< TProfileMetaData >;
  readonly data: Resource< TProfileData >;
  readonly history: Resource< TProfileHistory >;
}

export type ProfileItem< T > = Readonly< T & { uri: string } & ProfileResources >;

export interface Collection< T > extends Iterable< T > {
  readonly items: ProfileItem< T >[];
  readonly total: number;
  readonly count: number;
  position: number;

  readonly current: ProfileItem< T > | null;
  readonly first: ProfileItem< T > | null;
  readonly last: ProfileItem< T > | null;

  readonly hasNext: boolean;
  readonly hasPrev: boolean;

  readonly next: ProfileItem< T > | null;
  readonly prev: ProfileItem< T > | null;

  at ( index: number ) : ProfileItem< T > | null;
  get ( uri: string ) : ProfileItem< T > | null;
  find ( uriLike: string ) : ProfileItem< T > | null;
  filter ( predicate: ( item: ProfileItem< T > ) => boolean ) : Collection< T >;
  search ( query: string ) : Collection< T >;

  groupBy < K > ( callback: ( item: ProfileItem< T > ) => K ) : Map< K, Collection< T > >;
  orderBy ( key: keyof T, dir?: 'asc' | 'desc' ) : Collection< T >;
  sort ( compare: ( a: ProfileItem< T >, b: ProfileItem< T > ) => number ) : Collection< T >;

  toArray () : ProfileItem< T >[];
  map < R > ( callback: ( item: ProfileItem< T >, index: number ) => R ) : R[];

  take ( count: number ) : Collection< T >;
  skip ( count: number ) : Collection< T >;
  slice ( start?: number, end?: number ) : Collection< T >;

  page ( page: number, perPage?: number ) : Collection< T >;
}
