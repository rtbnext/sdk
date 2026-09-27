// --- indexable ---

/**
 * A function that resolves a nested index path to a resource.
 * 
 * @template R - The type of individual resources returned by the index factory function.
 */
export type IndexFn< R > = ( path: readonly string[] ) => R;

/** A function that extracts index keys from a value. */
export type KeysFn = ( value: unknown ) => readonly string[] | null;
