// --- abstract ---

/**
 * A function to transform an item of type T into an item of type R.
 * 
 * @template T - The type of the input item.
 * @template R - The type of the output item.
 */
export type ItemFactory< T, R > = ( item: T ) => R;

/**
 * A function to transform an item of type T into a string representation
 * 
 * @template T - The type of the input item.
 */
export type DateResolver< T > = ( item: T ) => string;


// --- collectable ---

/**
 * Represents an item contained in a collection.
 * Items may provide a URI and additional searchable or sortable properties.
 */
export interface CollectItem {
  /** The resource URI, when available. */
  uri?: string;
  /** The normalized search name, if available. */
  searchName?: string;
  /** The display name, if available. */
  name?: string;
  /** The searchable text, if available. */
  text?: string;
}

/** Represents a collectable API item with a unique URI. */
export interface URICollectItem extends CollectItem {
  /** The unique resource URI. */
  uri: string;
}

/**
 * Represents the parsed data of a collection resource.
 * 
 * @template I - The type of collectable item.
 */
export interface CollectData< I extends CollectItem > {
  /** The items returned by the API. */
  items: ReadonlyArray< I >;
}

/**
 * A normalized entity type for collection items.
 * 
 * @template I - The type of collectable item.
 * @template T - The type of additional properties to include in the entity.
 */
export type Entity< I extends CollectItem, T = unknown > = Readonly< I & T >;

/**
 * Resolves a collectable item into an entity.
 * 
 * @template I - The type of collectable item.
 * @template E - The type of resolved entity.
 */
export type EntityFn< I extends CollectItem, E extends Entity< I > > = ItemFactory< I, E >;

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

/**
 * Compares two items for equality.
 * 
 * @template I - The type of collectable item.
 */
export type CompareFn< I extends CollectItem > = ( left: I, right: I ) => boolean;


// --- time series ---

/** Supported aggregation periods for time-series data. */
export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

/**
 * A function to extract a numeric value from a time-series point.
 * 
 * @template R - The type of the time-series point.
 */
export type NumberCallback< R > = ( point: R ) => number;

/** A time-series point containing a date. */
export interface TimePoint {
  /** The date of the time-series point. */
  date: string;
}

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
  /** The median numeric value in the range. */
  median: number;
  /** The total sum of numeric values in the range. */
  sum: number;
}

/** The date range covered by an aggregate point. */
export interface AggregateRange {
  /** The first date in the range. */
  from: string;
  /** The last date in the range. */
  to: string;
}

/** An aggregated point derived from a time-series record. */
export type AggregatePoint< R extends TimePoint > = {
  [ K in keyof Omit< R, 'date' > ]: R[ K ] extends number ? AggregateValue : R[ K ];
} & {
  /** The point's date. */
  date: string;
  /** The human-readable label for the aggregation. */
  label: string;
  /** The date range covered by this aggregate point. */
  range: AggregateRange;
};
