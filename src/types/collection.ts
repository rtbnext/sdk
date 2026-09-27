// --- abstract ---

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

/** A normalized entity type for collection items. */
export type Entity< I extends CollectItem, T = unknown > = Readonly< I & CollectItem & T >;

/**
 * Resolves a collectable item into an entity.
 * 
 * @template I - The type of collectable item.
 * @template E - The type of resolved entity.
 */
export type EntityFn< I extends CollectItem, E extends Entity< I > > = ItemFactory< I, E >;
