import type { CollectData, CollectItem, Entity } from '../types/collection';
import { Resource } from './Resource';


/**
 * Provides a resource wrapper for collection-oriented API endpoints.
 * 
 * This class converts raw API items into entities and exposes them through
 * a lazily created collectable collection.
 * 
 * @template D - The parsed resource data type.
 * @template I - The type of raw collectable items.
 * @template E - The type of resolved entities.
 */
export class CollectableResource<
  D extends CollectData< I >,
  I extends CollectItem,
  E extends Entity< I >
> extends Resource< D > {}
