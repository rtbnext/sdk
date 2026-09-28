import type { StateLoader } from '../core/StateLoader';
import type { ResourcePool } from '../resource/ResourcePool';
import type { Endpoints } from '../types/endpoint';


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
}
