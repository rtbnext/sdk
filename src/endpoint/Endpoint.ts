import type { StateLoader } from '../core/StateLoader';
import { json, parser } from '../parser';
import { CollectableResource } from '../resource/CollectableResource';
import { Resource } from '../resource/Resource';
import type { ResourcePool } from '../resource/ResourcePool';
import type { ParserMode } from '../types/core';
import type { Endpoints } from '../types/endpoint';
import type { CollectData, CollectItem, EntityFn, FindFn, SearchFn } from '../types/resource';


/**
 * Abstract base class for SDK endpoint implementations.
 * 
 * Provides shared resource factory helpers for text, JSON, CSV, collection, index,
 * time series, and date resources.
 */
export abstract class Endpoint {
  /**
   * Creates a new Endpoint instance.
   * 
   * @param loader - The shared resource state loader instance.
   * @param pool - The shared resource pool for caching and reusing resources.
   * @param endpoints - The root endpoint registry for cross-endpoint references.
   */
  public constructor (
    protected readonly loader: StateLoader,
    protected readonly pool: ResourcePool,
    protected readonly endpoints: Endpoints
  ) {}

  /**
   * Creates a new resource instance for the given path and parser mode.
   * 
   * @param path - The resource path.
   * @param mode - The parser mode to use for the resource.
   * @returns A new Resource instance.
   */
  protected resource < D > ( path: string, mode: ParserMode ) : Resource< D > {
    return this.pool.get( path, () => new Resource< D >( path, this.loader, parser( mode ) ) );
  }

  /**
   * Creates a new collectable resource.
   * 
   * @param path - The resource path.
   * @param entity - The factory used to resolve items into entities.
   * @param find - Optional function used to find items by URI-like values.
   * @param search - Optional function used to match search queries.
   * @returns A collectable resource.
   */
  protected collectable< D extends CollectData< I >, I extends CollectItem, E > (
    path: string, entity: EntityFn< I, E >, find?: FindFn< I >, search?: SearchFn< I >
  ) : CollectableResource< D, I, E > {
    return this.pool.get( path, () => new CollectableResource< D, I, E >(
      path, this.loader, json, entity, find, search
    ) );
  }
}
