import type { CollectItem, EntityFn, FindFn, SearchFn } from '../types/collection';
import { CursorCollection } from './CursorCollection';


/**
 * Provides collection operations for entity-based resources.
 * 
 * This class extends the cursor collection with searching, filtering,
 * grouping, sorting and set operations.
 * 
 * @template I - The type of raw collectable items.
 * @template E - The type of resolved entities.
 * @template K - The type of group keys.
 */
export class CollectCollection< I extends CollectItem, E > extends CursorCollection< I, E > {
  /** The function used to find items by URI-like values. */
  protected readonly findFn: FindFn< I >;
  /** The function used to test items against search queries. */
  protected readonly searchFn: SearchFn< I >;

  /**
   * Creates a new collectable collection.
   * 
   * @param items - The collectable items contained in the collection.
   * @param factory - The factory used to resolve items into entities.
   * @param total - The total number of available items.
   * @param find - Optional function used to find items by URI-like values.
   * @param search - Optional function used to match search queries.
   */
  public constructor (
    items: ReadonlyArray< I >, factory: EntityFn< I, E >, total?: number,
    find?: FindFn< I >, search?: SearchFn< I >
  ) {
    super( items, factory, total );

    this.findFn = find ?? CollectCollection.defaultFind;
    this.searchFn = search ?? CollectCollection.defaultSearch;
  }
}
