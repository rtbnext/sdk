import { HttpClient } from './core/HttpClient';
import { StateLoader } from './core/StateLoader';
import { ResourcePool } from './resource/ResourcePool';
import type { RTBNextOptions } from './types/core';
import type { Endpoints, ISystem } from './types/endpoint';


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
  /** The collection of endpoint clients available in the SDK. */
  public readonly endpoints: Endpoints;

  /** The System endpoint. */
  public readonly system: ISystem;

  /**
   * Creates a new RTBNext SDK instance.
   * 
   * @param options - Configuration options for the SDK.
   * @throws Error if the client identity is not provided in the options.
   */
  public constructor ( options: RTBNextOptions ) {
    if ( ! options?.client?.name || ! options?.client?.version )
      throw new Error( 'Client identity is required for RTBNext SDK initialization.' );

    const { baseUrl, client, httpTimeout: timeout, cache } = options;
    this.httpClient = new HttpClient( { baseUrl, client, timeout } );
    this.stateLoader = StateLoader.getInstance( this.httpClient, cache );
    this.resourcePool = new ResourcePool();

    const endpoints = {} as Endpoints;
    const args = [ this.stateLoader, this.resourcePool, endpoints ] as const;
  }
}
