import { CollectCollection } from '../collection/CollectCollection';
import { StateLoader } from '../core/StateLoader';
import type { CollectData, CollectItem, EntityFn, FindFn, SearchFn } from '../types/collection';
import type { ParserFn } from '../types/core';
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
export class CollectableResource< D extends CollectData< I >, I extends CollectItem, E > extends Resource< D > {
  /** The factory used to resolve raw items into entities. */
  protected readonly entity: EntityFn< I, E >;
  /** Optional custom item finder. */
  protected readonly findFn?: FindFn< I >;
  /** Optional custom search matcher. */
  protected readonly searchFn?: SearchFn< I >;

  /**
   * Creates a new collectable resource.
   * 
   * @param path - The resource path for the API request.
   * @param loader - The resource state loader used to fetch data.
   * @param parser - The parser function used to decode the response.
   * @param entity - The factory used to resolve items into entities.
   * @param find - Optional function used to find items by URI-like values.
   * @param search - Optional function used to match search queries.
   */
  public constructor (
    path: string, loader: StateLoader, parser: ParserFn< D >, entity: EntityFn< I, E >,
    find?: FindFn< I >, search?: SearchFn< I >
  ) {
    super( path, loader, parser );

    this.entity = entity;
    this.findFn = find;
    this.searchFn = search;
  }

  /**
   * Creates a collection from collectable items.
   * 
   * @param items - The items to wrap.
   * @returns A new collectable collection.
   */
  protected collect ( items: ReadonlyArray< I > ) : CollectCollection< I, E > {
    return new CollectCollection( items, this.entity, undefined, this.findFn, this.searchFn );
  }

  /** Returns the resource collection. */
  public collection () : Promise< CollectCollection< I, E > > {
    return this.transform( data => this.collect( data.items ) );
  }
}
