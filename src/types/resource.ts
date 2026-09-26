// --- factories ---

/** A function to transform an item of type T into an item of type R. */
export type ItemFactory< T, R > = ( item: T ) => R;

/** A function to transform an item of type T into a string representation. */
export type DateResolver< T > = ( item: T ) => string;

// --- collectable ---

/**
 * Represents a collectable API item.
 * 
 * Collectable items must provide a unique URI and may contain additional
 * searchable or sortable properties.
 */
export interface CollectItem {
  /** The unique resource URI. */
  uri: string;
  /** The normalized search name, if available. */
  searchName?: string;
  /** The display name, if available. */
  name?: string;
  /** The searchable text, if available. */
  text?: string;
  /** Additional API properties. */
  [ key: string ]: unknown;
}

/**
 * Represents the parsed data of a collectable resource.
 * 
 * @template I - The type of collectable item.
 */
export interface CollectData< I extends CollectItem > {
  /** The collectable items returned by the API. */
  items: ReadonlyArray< I >;
}

/**
 * Resolves a collectable item into an entity.
 * 
 * @template I - The type of collectable item.
 * @template E - The type of resolved entity.
 */
export type EntityFn< I, E > = ItemFactory< I, E >;

/**
 * Finds an item using a URI-like value.
 * 
 * @template I - The type of collectable item.
 */
export type FindFn< I extends CollectItem > = (
  items: ReadonlyArray< I >, uriLike: string
) => I | undefined;


/**
 * Tests whether an item matches a search query.
 * 
 * @template I - The type of collectable item.
 */
export type SearchFn< I extends CollectItem > = (
  item: I, query: string, terms: ReadonlyArray< string >
) => boolean;


// --- indexable ---

/** A function that resolves a nested index path to a resource. */
export type IndexFn< R > = ( path: readonly string[] ) => R;

/** A function that extracts index keys from a value. */
export type KeysFn = ( value: unknown ) => readonly string[] | null;

/** A record of nested resources accessible by index paths. */
export type ResourceTree = Readonly< Record< string, unknown > >;

/** The set of object keys usable for index traversal. */
export type IndexKeys< T > = Exclude< keyof T, '$metadata' >;

/** Extracts the leaf keys from a nested index structure. */
type IndexLeaf< T > =
  T extends readonly ( infer I )[]
    ? I extends string ? I : never
    : T extends { items: infer I }
      ? I extends readonly ( infer E )[]
        ? E extends string ? E : never
        : Extract< keyof I, string >
      : never;

/** Recursive index result type for nested index structures. */
export type IndexResult< T, R > =
  IndexLeaf< T > extends never
    ? T extends object ? {
      [ K in IndexKeys< T > ]: IndexResult< T[ K ], R >;
    } : never
    : Record< IndexLeaf< T >, R >;

// --- dateable ---

/** A function that resolves a date string to a resource. */
export type DateFn< R > = ( item: string ) => R;

/** Parsed data returned by a date-indexed endpoint. */
export interface DateData {
  /** The available date values. */
  dates: ReadonlyArray< string >;
}

// --- time series ---

/** A raw time-series row. */
export type TimeSeriesRow = readonly unknown[];

/** A time-series point containing a date. */
export interface TimePoint {
  /** The date of the time-series point. */
  date: string;
  /** Additional time-series values. */
  [ key: string ]: unknown;
}

/** A supported time-series aggregation period. */
export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

/** A numeric value extractor for time-series points. */
export type NumberCallback< R > = ( point: R ) => number;

/** A function that converts a raw time-series row into a typed point. */
export type PointFn< D, R > = ( row: D ) => R;

/** Statistical values calculated for an aggregated column. */
export interface AggregateValue {
  /** The first value in the aggregation range. */
  first: number;
  /** The last value in the aggregation range. */
  last: number;
  /** The minimum value in the aggregation range. */
  min: number;
  /** The maximum value in the aggregation range. */
  max: number;
  /** The arithmetic mean of the values. */
  avg: number;
  /** The median of the values. */
  median: number;
  /** The sum of the values. */
  sum: number;
}

/** The date range covered by an aggregate point. */
export interface AggregateRange {
  /** The first date in the range. */
  from: string;
  /** The last date in the range. */
  to: string;
}

/** An aggregated time-series point. */
export interface AggregatePoint {
  /** The last date in the aggregation range. */
  date: string;
  /** The aggregation label. */
  label: string;
  /** The date range covered by the aggregation. */
  range: AggregateRange;
  /** Additional aggregated columns. */
  [ key: string ]: unknown;
}
