// --- collectable resource ---

export type Entity< I, T = unknown > = Readonly< I & { uri: string } & T >;

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

// --- indexable resource ---

export type IndexFn< R > = ( path: readonly string[] ) => R;

export type KeysFn = ( value: unknown ) => readonly string[] | null;

export interface IndexOptions< R > {
  index: IndexFn< R >;
  keys?: KeysFn;
}

export type IndexKeys< T > = Exclude< keyof T, '$metadata' >;

type IndexLeaf< T > =
  T extends readonly ( infer I )[]
    ? I extends string ? I : never
    : T extends { items: infer I }
      ? Extract< keyof I, string >
      : never;

export type IndexResult< T, R > =
  IndexLeaf< T > extends never
    ? T extends object ? {
      [ K in IndexKeys< T > ]: IndexResult< T[ K ], R >;
    } : never
    : Record< IndexLeaf< T >, R >;

// --- dateable resource ---

export type DateFn< R > = ( value: string ) => R;

export interface DateOptions< R > {
  date: DateFn< R >;
}

export interface Dates< R > extends Iterable< R > {
  readonly dates: string[];
  readonly total: number;
  readonly count: number;

  readonly first: R | null;
  readonly last: R | null;

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

// --- time series resource ---

export type PointFn< D extends readonly unknown[], R extends { date: string } > = ( row: D[ number ] ) => R;

export interface TimeSeriesOptions< D extends readonly unknown[], R extends { date: string } > {
  point: PointFn< D, R >;
}

export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface AggregateValue {
  first: number;
  last: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export type AggregatePoint< R extends { date: string } > = {
  [ K in keyof Omit< R, 'date' > ]: R[ K ] extends number ? AggregateValue : R[ K ];
} & {
  date: string;
  label: string;
  range: {
    from: string;
    to: string;
  };
};

export interface TimeSeries< R extends { date: string } > extends Iterable< R > {
  readonly points: R[];
  readonly total: number;
  readonly count: number;

  readonly first: R | null;
  readonly last: R | null;

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
  sum ( callback?: ( point: R ) => number ) : number;
  avg ( callback?: ( point: R ) => number ) : number;
  median ( callback?: ( point: R ) => number ) : number;

  readonly labels: string[];
  readonly columns: Record< keyof R, unknown[] >;

  values ( callback: ( point: R ) => number ) : number[];
  column < K extends keyof R > ( key: K ) : R[ K ][];

  aggregate ( period: AggregatePeriod | ( ( point: R ) => string ) ) : TimeSeries< AggregatePoint< R > >;
  buckets ( count: number ) : TimeSeries< AggregatePoint< R > >;
}

// --- options ---

export type JsonOptions< R, D > =
  | IndexOptions< R >
  | DateOptions< D >;

export type CsvOptions< D extends readonly unknown[], R extends { date: string } > =
  | TimeSeriesOptions< D, R >;
