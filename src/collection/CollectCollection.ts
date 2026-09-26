import type { CollectItem, FindFn, SearchFn } from '../types/collection';
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
}
