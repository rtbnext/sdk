import { HttpClient } from './core/HttpClient';
import { StateLoader } from './core/StateLoader';
import { Filter } from './endpoint/Filter';
import { List } from './endpoint/List';
import { Mover } from './endpoint/Mover';
import { Profile } from './endpoint/Profile';
import { Stats } from './endpoint/Stats';
import { System } from './endpoint/System';
import { ResourcePool } from './resource/ResourcePool';
import type { RTBNextOptions } from './types/core';
import type {
  Endpoints, FilterEndpoint, ListEndpoint, MoverEndpoint,
  ProfileEndpoint, StatsEndpoint, SystemEndpoint
} from './types/endpoint';


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

  /** The Profile endpoint. */
  public readonly profile: ProfileEndpoint;
  /** The List endpoint. */
  public readonly list: ListEndpoint;
  /** The Mover endpoint. */
  public readonly mover: MoverEndpoint;
  /** The Filter endpoint. */
  public readonly filter: FilterEndpoint;
  /** The Stats endpoint. */
  public readonly stats: StatsEndpoint;
  /** The System endpoint. */
  public readonly system: SystemEndpoint;

  /**
   * Creates a new RTBNext SDK instance.
   * 
   * @param options - Configuration options for the SDK.
   * @throws Error if the client identity is not provided in the options.
   */
  public constructor ( options: RTBNextOptions ) {
    options = JSON.parse( JSON.stringify( options ) );

    if ( ! options?.client?.name || ! options?.client?.version )
      throw new Error( 'Client identity is required for RTBNext SDK initialization.' );

    this.httpClient = new HttpClient( options );
    this.stateLoader = StateLoader.getInstance( this.httpClient, options.cache );
    this.resourcePool = new ResourcePool();

    const endpoints = {} as Endpoints;
    const args = [ this.stateLoader, this.resourcePool, endpoints ] as const;

    this.profile = endpoints.profile = new Profile( ...args );
    this.list = endpoints.list = new List( ...args );
    this.mover = endpoints.mover = new Mover( ...args );
    this.filter = endpoints.filter = new Filter( ...args );
    this.stats = endpoints.stats = new Stats( ...args );
    this.system = endpoints.system = new System( ...args );

    this.endpoints = Object.freeze( endpoints );
  }
}
