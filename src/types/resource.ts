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
