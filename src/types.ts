import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Filter } from './endpoint/Filter';
import type { List } from './endpoint/List';
import type { Mover } from './endpoint/Mover';
import type { Profile } from './endpoint/Profile';
import type { Stats } from './endpoint/Stats';
import type { System } from './endpoint/System';
import type { Resource } from './resource/Resource';


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

export type ParserFn< D > = ( res: HttpResponse, ...args: any[] ) => D;

export type CollectionSearchFn< I > = ( item: Entity< I >, query: string, terms: string[] ) => boolean;

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

export type Entity< I, T = unknown > = Readonly< I & { uri: string } & T >;

export interface ProfileResources {
  readonly meta: Resource< TProfileMetaData >;
  readonly data: Resource< TProfileData >;
  readonly history: Resource< TProfileHistory >;
}

export type ProfileEntity< I > = Entity< I, ProfileResources >;

export interface Collection< D > extends Iterable< D > {
  readonly items: Entity< D >[];
  readonly total: number;
  readonly count: number;
  position: number;

  readonly current: Entity< D > | null;
  readonly first: Entity< D > | null;
  readonly last: Entity< D > | null;

  readonly hasNext: boolean;
  readonly hasPrev: boolean;

  readonly next: Entity< D > | null;
  readonly prev: Entity< D > | null;

  at ( index: number ) : Entity< D > | null;
  get ( uri: string ) : Entity< D > | null;
  find ( uriLike: string ) : Entity< D > | null;
  filter ( predicate: ( item: Entity< D > ) => boolean ) : Collection< D >;
  search ( query: string ) : Collection< D >;

  groupBy < K > ( callback: ( item: Entity< D > ) => K ) : Map< K, Collection< D > >;
  orderBy ( key: keyof D, dir?: 'asc' | 'desc' ) : Collection< D >;
  sort ( compare: ( a: Entity< D >, b: Entity< D > ) => number ) : Collection< D >;

  toArray () : Entity< D >[];
  map < R > ( callback: ( item: Entity< D >, index: number ) => R ) : R[];

  take ( count: number ) : Collection< D >;
  skip ( count: number ) : Collection< D >;
  slice ( start?: number, end?: number ) : Collection< D >;

  page ( page: number, perPage?: number ) : Collection< D >;
}

export type IndexFactory< R > = ( path: readonly string[] ) => R;

export type IndexKeys< T > = Exclude< keyof T, '$metadata' >;

export type IndexResult< T, R > = T extends readonly ( infer I )[]
  ? I extends string ? Record< I, R > : never
  : T extends object ? { [ K in IndexKeys< T > ]: IndexResult< T[ K ], R > } : never;

export type CollectOptions< I extends { uri: string }, E extends Entity< I > > = {
  entity: ( item: I ) => E;
  search: CollectionSearchFn< I >;
};

export type IndexOptions< R > = {
  index: IndexFactory< R >;
};

export type ResourceOptions< I extends { uri: string }, E extends Entity< I >, R > =
  | CollectOptions< I, E >
  | IndexOptions< R >;
