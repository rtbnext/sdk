import { HttpClient } from './core/HttpClient';
import { StateLoader } from './core/StateLoader';
import { ResourcePool } from './resource/ResourcePool';


/**
 * Main entry point of the RTBNext SDK.
 * 
 * Provides access to all RTBNext API endpoints through a single client
 * instance while internally managing HTTP communication, resource loading,
 * caching, and endpoint initialization.
 */
export class RTBNext {
  /** The HTTP client used for all API requests. */
  private readonly httpClient: HttpClient;
  /** The state loader used for caching and fetching HTTP resources. */
  private readonly stateLoader: StateLoader;
  /** The resource pool used for caching and reusing resource instances. */
  private readonly resourcePool: ResourcePool;
}
