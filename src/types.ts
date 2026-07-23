import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { CollectableResource } from './core/resource/CollectableResource';
import type { Resource } from './core/resource/Resource';
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

export type AnyResource< T, R > = Resource< T > | CollectableResource< T, R >;

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

export type Entity< T, R = unknown > = Readonly< T & { uri: string } & R >;

export interface ProfileResources {
  readonly meta: Resource< TProfileMetaData >;
  readonly data: Resource< TProfileData >;
  readonly history: Resource< TProfileHistory >;
}

export type ProfileEntity< T > = Entity< T, ProfileResources >;

export type CollectionSearchFn< T > = ( item: Entity< T >, query: string, terms: string[] ) => boolean;

export interface Collection< T > extends Iterable< T > {
  readonly items: Entity< T >[];
  readonly total: number;
  readonly count: number;
  position: number;

  readonly current: Entity< T > | null;
  readonly first: Entity< T > | null;
  readonly last: Entity< T > | null;

  readonly hasNext: boolean;
  readonly hasPrev: boolean;

  readonly next: Entity< T > | null;
  readonly prev: Entity< T > | null;

  at ( index: number ) : Entity< T > | null;
  get ( uri: string ) : Entity< T > | null;
  find ( uriLike: string ) : Entity< T > | null;
  filter ( predicate: ( item: Entity< T > ) => boolean ) : Collection< T >;
  search ( query: string ) : Collection< T >;

  groupBy < K > ( callback: ( item: Entity< T > ) => K ) : Map< K, Collection< T > >;
  orderBy ( key: keyof T, dir?: 'asc' | 'desc' ) : Collection< T >;
  sort ( compare: ( a: Entity< T >, b: Entity< T > ) => number ) : Collection< T >;

  toArray () : Entity< T >[];
  map < R > ( callback: ( item: Entity< T >, index: number ) => R ) : R[];

  take ( count: number ) : Collection< T >;
  skip ( count: number ) : Collection< T >;
  slice ( start?: number, end?: number ) : Collection< T >;

  page ( page: number, perPage?: number ) : Collection< T >;
}
