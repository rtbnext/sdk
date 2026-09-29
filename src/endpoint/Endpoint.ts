import type { StateLoader } from '../core/StateLoader';
import { csv, json, parser } from '../parser';
import { CollectableResource } from '../resource/CollectableResource';
import { DateableResource } from '../resource/DateableResource';
import { IndexableResource } from '../resource/IndexableResource';
import { Resource } from '../resource/Resource';
import type { ResourcePool } from '../resource/ResourcePool';
import { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { CollectData, CollectItem, Entity, EntityFn, FindFn, SearchFn, TimePoint } from '../types/collection';
import type { ParserMode } from '../types/core';
import type { Endpoints } from '../types/endpoint';
import type { DateData, DateFn, IndexFn, KeysFn, PointFn, TimeSeriesData } from '../types/resource';


/**
 * Abstract base class for SDK endpoint implementations.
 * 
 * Provides shared functionality for resource creation, caching, and endpoint management.
 * Exposes protected methods for creating collectable, dateable, indexable,
 * and time-series resources.
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
   * @template D - The expected data type of the resource.
   * @param path - The resource path.
   * @param mode - The parser mode to use for the resource.
   * @returns A new Resource instance.
   */
  protected resource < D > ( path: string, mode: ParserMode = 'json' ) : Resource< D > {
    return this.pool.get( path, () => new Resource< D >( path, this.loader, parser( mode ) ) );
  }

  /**
   * Creates a new collectable resource.
   * 
   * @template D - The parsed resource data type.
   * @template I - The type of raw collectable items.
   * @template E - The type of resolved entities.
   * @param path - The resource path.
   * @param entity - The factory used to resolve items into entities.
   * @param find - Optional function used to find items by URI-like values.
   * @param search - Optional function used to match search queries.
   * @returns A collectable resource.
   */
  protected collectable < D extends CollectData< I >, I extends CollectItem, E extends Entity< I > > (
    path: string, entity: EntityFn< I, E >, find?: FindFn< I >, search?: SearchFn< I >
  ) : CollectableResource< D, I, E > {
    return this.pool.get( path, () =>
      new CollectableResource< D, I, E >( path, this.loader, json, entity, find, search )
    );
  }

  /**
   * Creates a new dateable resource.
   * 
   * @template D - The raw data type of the resource.
   * @template R - The type of individual resources returned by the date factory.
   * @param path - The resource path.
   * @param date - The factory used to resolve dates into resources.
   * @returns A dateable resource.
   */
  protected dateable < D extends DateData, R > (
    path: string, date: DateFn< R >
  ) : DateableResource< D, R > {
    return this.pool.get( path, () =>
      new DateableResource< D, R >( path, this.loader, json, date )
    );
  }

  /**
   * Creates a new indexable resource.
   * 
   * @template D - The raw data type of the resource.
   * @template R - The type of individual resources returned by the index factory function.
   * @param path - The resource path.
   * @param index - The factory used to resolve indexed paths.
   * @param keys - Optional function used to determine child keys.
   * @returns An indexable resource.
   */
  protected indexable < D, R > (
    path: string, index: IndexFn< R >, keys?: KeysFn
  ) : IndexableResource< D, R > {
    return this.pool.get( path, () =>
      new IndexableResource< D, R >( path, this.loader, json, index, keys )
    );
  }

  /**
   * Creates a new time-series resource.
   * 
   * @template D - The raw data type of the resource.
   * @template R - The type of individual time-series points.
   * @param path - The resource path.
   * @param point - The factory used to convert rows into typed points.
   * @returns A time-series resource.
   */
  protected series < D extends TimeSeriesData, R extends TimePoint > (
    path: string, point: PointFn< D, R >
  ) : TimeSeriesResource< D, R > {
    return this.pool.get( path, () =>
      new TimeSeriesResource< D, R >( path, this.loader, csv, point )
    );
  }
}
