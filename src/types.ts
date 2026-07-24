import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Filter } from './endpoint/Filter';
import type { List } from './endpoint/List';
import type { Mover } from './endpoint/Mover';
import type { Profile } from './endpoint/Profile';
import type { Stats } from './endpoint/Stats';
import type { System } from './endpoint/System';
import type { Resource } from './resource/Resource';
import type { TimeSeriesResource } from './resource/TimeSeriesResource';


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

export type HistoryPoint = {
  date: string;
  count: number;
  total: number;
  woman: number;
  quota: number;
  change: number;
  changePct: number;
};

export type ProfileHistoryPoint = {
  date: string;
  rank: number;
  networth: number;
  change: number;
  changePct: number;
};

export interface ProfileResources {
  readonly meta: Resource< TProfileMetaData >;
  readonly data: Resource< TProfileData >;
  readonly history: TimeSeriesResource< TProfileHistory, ProfileHistoryPoint >;
}

export type ProfileEntity< I > = Entity< I, ProfileResources >;

export interface Collection< I extends { uri: string } > extends Iterable< I > {
  readonly items: Entity< I >[];
  readonly total: number;
  readonly count: number;
  position: number;

  readonly current: Entity< I > | null;
  readonly first: Entity< I > | null;
  readonly last: Entity< I > | null;

  readonly hasNext: boolean;
  readonly hasPrev: boolean;

  readonly next: Entity< I > | null;
  readonly prev: Entity< I > | null;

  at ( index: number ) : Entity< I > | null;
  get ( uri: string ) : Entity< I > | null;
  find ( uriLike: string ) : Entity< I > | null;
  filter ( predicate: ( item: Entity< I > ) => boolean ) : Collection< I >;
  search ( query: string ) : Collection< I >;

  intersect ( other: Collection< I > ) : Collection< I >;
  exclude ( other: Collection< I > ) : Collection< I >;
  union ( other: Collection< I > ) : Collection< I >;

  groupBy < K > ( callback: ( item: Entity< I > ) => K ) : Map< K, Collection< I > >;
  orderBy ( key: keyof I, dir?: 'asc' | 'desc' ) : Collection< I >;
  sort ( compare: ( a: Entity< I >, b: Entity< I > ) => number ) : Collection< I >;

  toArray () : Entity< I >[];
  map < R > ( callback: ( item: Entity< I >, index: number ) => R ) : R[];

  take ( count: number ) : Collection< I >;
  skip ( count: number ) : Collection< I >;
  slice ( start?: number, end?: number ) : Collection< I >;

  page ( page: number, perPage?: number ) : Collection< I >;
}

export type IndexFactory< R > = ( path: readonly string[] ) => R;

export type IndexKeys< T > = Exclude< keyof T, '$metadata' >;

export type IndexResult< T, R > = T extends readonly ( infer I )[]
  ? I extends string ? Record< I, R > : never
  : T extends object ? { [ K in IndexKeys< T > ]: IndexResult< T[ K ], R > } : never;

export interface Dates< R > extends Iterable< R > {
  readonly dates: string[];
  readonly total: number;
  readonly count: number;

  readonly first: R | null;
  readonly last: R | null;

  get ( date: string ) : R | null;
  find ( date: string ) : R | null;

  year ( year: number ) : Dates< R >;
  month ( year: number, month: number ) : Dates< R >;

  before ( date: string ) : Dates< R >;
  after ( date: string ) : Dates< R >;
  since ( date: string ) : Dates< R >;
  until ( date: string ) : Dates< R >;
  between ( from: string, to: string ) : Dates< R >;

  toArray () : R[];
  map < T > ( callback: ( item: R, index: number ) => T ) : T[];

  take ( count: number ) : Dates< R >;
  skip ( count: number ) : Dates< R >;
  slice ( start?: number, end?: number ) : Dates< R >;
}

export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

export type AggregateValue = {
  first: number;
  last: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
};

export type AggregatePoint< R extends { date: string } > = {
  date: string;
  label: string;
  range: {
    from: string;
    to: string;
  };
} & {
  [ K in keyof Omit< R, 'date' > ]:
    R[ K ] extends number ? AggregateValue : R[ K ];
};

export interface TimeSeries< R extends { date: string } > extends Iterable< R > {
  readonly points: R[];
  readonly total: number;
  readonly count: number;

  readonly first: R | null;
  readonly last: R | null;

  get ( date: string ) : R | null;
  find ( date: string ) : R | null;

  year ( year: number ) : TimeSeries< R >;
  month ( year: number, month: number ) : TimeSeries< R >;

  before ( date: string ) : TimeSeries< R >;
  after ( date: string ) : TimeSeries< R >;
  since ( date: string ) : TimeSeries< R >;
  until ( date: string ) : TimeSeries< R >;
  between ( from: string, to: string ) : TimeSeries< R >;

  toArray () : R[];
  map < T > ( callback: ( item: R, index: number ) => T ) : T[];

  take ( count: number ) : TimeSeries< R >;
  skip ( count: number ) : TimeSeries< R >;
  slice ( start?: number, end?: number ) : TimeSeries< R >;

  min ( callback?: ( point: R ) => number ) : number;
  max ( callback?: ( point: R ) => number ) : number;
  avg ( callback?: ( point: R ) => number ) : number;
  median ( callback?: ( point: R ) => number ) : number;

  labels () : string[];
  values ( callback: ( point: R ) => number ) : number[];
  column < K extends keyof R > ( key: K ) : R[ K ][];
  columns () : Record< keyof R, unknown[] >;

  sample ( count: number ) : TimeSeries< AggregatePoint< R > >;
  aggregate ( period: AggregatePeriod | ( ( point: R ) => string ) ) : TimeSeries< AggregatePoint< R > >;
}

export type CollectOptions< I extends { uri: string }, E extends Entity< I > > = {
  entity ( item: I ) : E;
  search: CollectionSearchFn< I >;
};

export type IndexOptions< R > = {
  index: IndexFactory< R >;
};

export interface DateOptions< R > {
  date ( value: string ) : R;
}

export type TimeSeriesOptions< D extends readonly unknown[], R > = {
  point ( row: D[ number ] ) : R;
};

export type JsonOptions< I extends { uri: string }, E extends Entity< I >, R, D > =
  | CollectOptions< I, E >
  | IndexOptions< R >
  | DateOptions< D >;

export type CsvOptions< D extends readonly unknown[], R > =
  | TimeSeriesOptions< D, R >;
