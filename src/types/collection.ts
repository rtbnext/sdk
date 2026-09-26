// --- factories ---

/** A function to transform an item of type T into an item of type R. */
export type ItemFactory< T, R > = ( item: T ) => R;

/** A function to transform an item of type T into a string representation. */
export type DateResolver< T > = ( item: T ) => string;
