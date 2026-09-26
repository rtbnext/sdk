/** A function that resolves a nested index path to a resource. */
export type IndexFn< R > = ( path: readonly string[] ) => R;

/** A function that extracts index keys from a value. */
export type KeysFn = ( value: unknown ) => readonly string[] | null;

/** Options for indexable resources. */
export interface IndexOptions< R > {
  /** Maps a path to a nested resource. */
  index: IndexFn< R >;
  /** Optionally derives keys from a value. */
  keys?: KeysFn;
}

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
