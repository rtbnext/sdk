// --- dateable ---

/** A function that resolves a date string to a resource. */
export type DateFn< R > = ( item: string ) => R;

/** Parsed data returned by a date-indexed endpoint. */
export interface DateData {
  /** The available date values. */
  dates: ReadonlyArray< string >;
}


// --- indexable ---

/**
 * A function that resolves a nested index path to a resource.
 * 
 * @template R - The type of individual resources returned by the index factory function.
 */
export type IndexFn< R > = ( path: readonly string[] ) => R;

/** A function that extracts index keys from a value. */
export type KeysFn = ( value: unknown ) => readonly string[] | null;

/** A record of nested resources accessible by index paths. */
export type ResourceTree = Readonly< Record< string, unknown > >;

/**
 * The set of object keys usable for index traversal.
 * 
 * @template T - The type of the object from which to extract keys.
 */
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

/**
 * Recursive index result type for nested index structures.
 * 
 * @template T - The type of the nested index structure.
 * @template R - The type of individual resources returned by the index factory function.
 */
export type IndexResult< T, R > =
  IndexLeaf< T > extends never
    ? T extends object ? {
      [ K in IndexKeys< T > ]: IndexResult< T[ K ], R >;
    } : never
    : Record< IndexLeaf< T >, R >;


// --- time series ---

export type TimeSeriesRow = unknown[];
