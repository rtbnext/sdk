// --- collectable resource ---

/** A normalized entity type for collection items. */
export type Entity< I extends { uri: string }, T = unknown > = Readonly< I & { uri: string } & T >;

/** A factory function that creates an entity from raw data. */
export type EntityFn< I extends { uri: string }, E extends Entity< I > > = ( data: I ) => E;

/** A function that finds an item by URI-like string. */
export type FindFn< I extends { uri: string } > = ( items: I[], uriLike: string ) => I | null;

/** A function that determines whether an item matches search terms. */
export type SearchFn< I extends { uri: string } > = ( item: Entity< I >, query: string, terms: string[] ) => boolean;

/** Options used when creating a collection resource from raw items. */
export type CollectOptions< I extends { uri: string }, E extends Entity< I > > = {
  /** Maps raw item data to an entity instance. */
  entity: EntityFn< I, E >;
  /** Optional custom URI lookup function. */
  find?: FindFn< I >;
  /** Optional search predicate for item queries. */
  search?: SearchFn< I >;
};

/** A collection of entities that can be iterated and queried. */
export interface Collection< I extends { uri: string } > extends Iterable< I > {
  /** The collection items as entities. */
  readonly items: Entity< I >[];
  /** The total number of items across all pages. */
  readonly total: number;
  /** The number of items in the current page. */
  readonly count: number;
  /** The current cursor position in the collection. */
  position: number;

  /** The currently selected item, if any. */
  readonly current: Entity< I > | null;
  /** The first item in the collection. */
  readonly first: Entity< I > | null;
  /** The last item in the collection. */
  readonly last: Entity< I > | null;

  /** Whether the collection has a next item. */
  readonly hasNext: boolean;
  /** Whether the collection has a previous item. */
  readonly hasPrev: boolean;

  /** The next item in the collection. */
  readonly next: Entity< I > | null;
  /** The previous item in the collection. */
  readonly prev: Entity< I > | null;

  /** Get the item at a specific index. */
  at ( index: number ) : Entity< I > | null;
  /** Get an item by its URI. */
  get ( uri: string ) : Entity< I > | null;
  /** Filter the collection using a predicate. */
  filter ( predicate: ( item: Entity< I > ) => boolean ) : Collection< I >;

  /** Find an item by URI-like text. */
  find ( uriLike: string ) : Entity< I > | null;
  /** Search the collection by query text. */
  search ( query: string ) : Collection< I >;

  /** Return collection items present in both collections. */
  intersect ( other: Collection< I > ) : Collection< I >;
  /** Return collection items not present in the other collection. */
  exclude ( other: Collection< I > ) : Collection< I >;
  /** Return collection items present in either collection. */
  union ( other: Collection< I > ) : Collection< I >;

  /** Group collection items by a callback result. */
  groupBy < K > ( callback: ( item: Entity< I > ) => K ) : Map< K, Collection< I > >;
  /** Order collection items by a key and direction. */
  orderBy ( key: keyof I, dir?: 'asc' | 'desc' ) : Collection< I >;
  /** Sort collection items with a custom comparison function. */
  sort ( compare: ( a: Entity< I >, b: Entity< I > ) => number ) : Collection< I >;

  /** Convert the collection to an array of entities. */
  toArray () : Entity< I >[];
  /** Map each entity in the collection to a new value. */
  map < R > ( callback: ( item: Entity< I >, index: number ) => R ) : R[];

  /** Take the first count items from the collection. */
  take ( count: number ) : Collection< I >;
  /** Skip the first count items in the collection. */
  skip ( count: number ) : Collection< I >;
  /** Slice a subset of the collection by start and end indexes. */
  slice ( start?: number, end?: number ) : Collection< I >;
  /** Return a specific page of the collection. */
  page ( page: number, perPage?: number ) : Collection< I >;
}

// --- indexable resource ---

/** A function that resolves a nested index path to a resource. */
export type IndexFn< R > = ( path: readonly string[] ) => R;

/** A function that extracts index keys from a value. */
export type KeysFn = ( value: unknown ) => readonly string[] | null;

/** Options for indexable resources. */
export interface IndexOptions< R > {
  /** Maps a path to a nested resource. */
  index: IndexFn< R >;
  /** Optionally derive keys from a value. */
  keys?: KeysFn;
}

/** The set of object keys usable for index traversal. */
export type IndexKeys< T > = Exclude< keyof T, '$metadata' >;

/** A recursive type that extracts the leaf keys of a nested index structure. */
type IndexLeaf< T > =
  T extends readonly ( infer I )[]
    ? I extends string ? I : never
    : T extends { items: infer I }
      ? Extract< keyof I, string >
      : never;

/** Recursive index result type for nested index structures. */
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

export type JsonOptions< I extends { uri: string }, E extends Entity< I >, R, D > =
  | CollectOptions< I, E >
  | IndexOptions< R >
  | DateOptions< D >;

export type CsvOptions< D extends readonly unknown[], R extends { date: string } > =
  | TimeSeriesOptions< D, R >;
