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
  /** Iterate over each entity in the collection. */
  forEach ( callback: ( item: Entity< I >, index: number ) => void ) : void;
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
  /** Iterate over the collection in pages of a given size. */
  pages ( perPage?: number ) : Generator< Collection< I > >;
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

/** A record of nested resources accessible by index paths. */
export type ResourceTree = Readonly< Record< string, unknown > >;

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

/** A function that maps a string date to a resource. */
export type DateFn< R > = ( value: string ) => R;

/** Options for date-indexed resources. */
export interface DateOptions< R > {
  /** Builds a resource for the given date. */
  date: DateFn< R >;
}

/** A date-indexed collection of resources. */
export interface Dates< R > extends Iterable< R > {
  /** The list of available date strings. */
  readonly dates: string[];
  /** The total number of date entries available. */
  readonly total: number;
  /** The number of entries in the current view. */
  readonly count: number;

  /** The first date entry. */
  readonly first: R | null;
  /** The last date entry. */
  readonly last: R | null;

  /** Find an entry by date string. */
  find ( date: string ) : R | null;
  /** Get the entries for a full year. */
  year ( year: number ) : Dates< R >;
  /** Get the entries for a specific month. */
  month ( year: number, month: number ) : Dates< R >;

  /** Get entries before the specified date. */
  before ( date: string ) : Dates< R >;
  /** Get entries after the specified date. */
  after ( date: string ) : Dates< R >;
  /** Get entries since the specified date. */
  since ( date: string ) : Dates< R >;
  /** Get entries until the specified date. */
  until ( date: string ) : Dates< R >;
  /** Get entries between two dates. */
  between ( from: string, to: string ) : Dates< R >;

  /** Convert dates to an array of resources. */
  toArray () : R[];
  /** Map each dated resource to a new value. */
  map < T > ( callback: ( item: R, index: number ) => T ) : T[];

  /** Take the first count date entries. */
  take ( count: number ) : Dates< R >;
  /** Skip the first count date entries. */
  skip ( count: number ) : Dates< R >;
  /** Slice a range of date entries. */
  slice ( start?: number, end?: number ) : Dates< R >;
}

// --- time series resource ---

/** Maps a raw time-series row to a point object. */
export type PointFn< D extends readonly unknown[], R extends { date: string } > = ( row: D[ number ] ) => R;

/** Options for time-series resource creation. */
export interface TimeSeriesOptions< D extends readonly unknown[], R extends { date: string } > {
  /** Converts a raw row into a time-series point. */
  point: PointFn< D, R >;
}

/** Supported aggregation periods for time-series data. */
export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

/** Aggregated numeric summary values. */
export interface AggregateValue {
  /** The first numeric value in the range. */
  first: number;
  /** The last numeric value in the range. */
  last: number;
  /** The minimum numeric value in the range. */
  min: number;
  /** The maximum numeric value in the range. */
  max: number;
  /** The average numeric value in the range. */
  avg: number;
  /** The total sum of numeric values in the range. */
  sum: number;
}

/** An aggregated point derived from a time-series record. */
export type AggregatePoint< R extends { date: string } > = {
  [ K in keyof Omit< R, 'date' > ]: R[ K ] extends number ? AggregateValue : R[ K ];
} & {
  /** The point's date. */
  date: string;
  /** The human-readable label for the aggregation. */
  label: string;
  /** The date range covered by this aggregate point. */
  range: {
    from: string;
    to: string;
  };
};

/** A time-series collection of dated resource points. */
export interface TimeSeries< R extends { date: string } > extends Iterable< R > {
  /** Time-series points. */
  readonly points: R[];
  /** Total number of points. */
  readonly total: number;
  /** The number of points in the current view. */
  readonly count: number;

  /** The first point in the series. */
  readonly first: R | null;
  /** The last point in the series. */
  readonly last: R | null;

  /** Find a point by date. */
  find ( date: string ) : R | null;
  /** Get points for an entire year. */
  year ( year: number ) : TimeSeries< R >;
  /** Get points for a specific month. */
  month ( year: number, month: number ) : TimeSeries< R >;

  /** Get points before a given date. */
  before ( date: string ) : TimeSeries< R >;
  /** Get points after a given date. */
  after ( date: string ) : TimeSeries< R >;
  /** Get points since a given date. */
  since ( date: string ) : TimeSeries< R >;
  /** Get points until a given date. */
  until ( date: string ) : TimeSeries< R >;
  /** Get points between two dates. */
  between ( from: string, to: string ) : TimeSeries< R >;

  /** Convert the series to an array of points. */
  toArray () : R[];
  /** Map each point in the series. */
  map < T > ( callback: ( item: R, index: number ) => T ) : T[];

  /** Take the first count points. */
  take ( count: number ) : TimeSeries< R >;
  /** Skip the first count points. */
  skip ( count: number ) : TimeSeries< R >;
  /** Slice a subset of points by index range. */
  slice ( start?: number, end?: number ) : TimeSeries< R >;

  /** Get the minimum numeric value over the series. */
  min ( callback?: ( point: R ) => number ) : number;
  /** Get the maximum numeric value over the series. */
  max ( callback?: ( point: R ) => number ) : number;
  /** Get the sum of numeric values over the series. */
  sum ( callback?: ( point: R ) => number ) : number;
  /** Get the average of numeric values over the series. */
  avg ( callback?: ( point: R ) => number ) : number;
  /** Get the median of numeric values over the series. */
  median ( callback?: ( point: R ) => number ) : number;

  /** All label keys (dates) from the series. */
  readonly labels: string[];
  /** Columnar representation keyed by field. */
  readonly columns: Record< keyof R, unknown[] >;

  /** Convert each point to a numeric series. */
  values ( callback: ( point: R ) => number ) : number[];
  /** Get a column of values for the given field. */
  column < K extends keyof R > ( key: K ) : R[ K ][];

  /** Aggregate the series using a period or callback. */
  aggregate ( period: AggregatePeriod | ( ( point: R ) => string ) ) : TimeSeries< AggregatePoint< R > >;
  /** Bucket series points into aggregated groups. */
  buckets ( count: number ) : TimeSeries< AggregatePoint< R > >;
}

// --- options ---

/** Union of supported JSON resource option types. */
export type JsonOptions< I extends { uri: string }, E extends Entity< I >, R, D > =
  | CollectOptions< I, E >
  | IndexOptions< R >
  | DateOptions< D >;

/** Union of supported CSV resource option types. */
export type CsvOptions< D extends readonly unknown[], R extends { date: string } > =
  | TimeSeriesOptions< D, R >;
