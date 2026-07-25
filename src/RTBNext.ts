import { HttpClient } from './core/HttpClient';
import { ResourceLoader } from './core/ResourceLoader';
import { Filter } from './endpoint/Filter';
import { List } from './endpoint/List';
import { Mover } from './endpoint/Mover';
import { Profile } from './endpoint/Profile';
import { Stats } from './endpoint/Stats';
import { System } from './endpoint/System';
import type { RTBNextOptions } from './types/core';
import type { Endpoints } from './types/endpoint';


/** Default configuration options for the RTBNext SDK. */
const DEFAULT_OPTIONS = {
  sdkVersion: '1.0.0',
  baseUrl: 'https://api.rtbnext.de',
  httpTimeout: 5_000,
  limiter: { maxRequests: 60, perMs: 10_000 },
  cache: { type: 'memory', mode: 'ttl' }
} as const;


/**
 * The primary SDK entry point for interacting with the RTBNext API.
 * 
 * This class configures the HTTP client, cache loader, and all available
 * endpoint clients so they can be used from a single SDK instance.
 */
export class RTBNext {
  /** The HTTP client used for all API requests. */
  public readonly httpClient: HttpClient;
  /** The resource loader used for caching and fetching resources. */
  public readonly resourceLoader: ResourceLoader;
  /** The collection of endpoint clients available in the SDK. */
  public readonly endpoints: Endpoints;

  /** The Profile endpoint. */
  public readonly profile: Profile;
  /** The List endpoint. */
  public readonly list: List;
  /** The Mover endpoint. */
  public readonly mover: Mover;
  /** The Filter endpoint. */
  public readonly filter: Filter;
  /** The Stats endpoint. */
  public readonly stats: Stats;
  /** The System endpoint. */
  public readonly system: System;

  /**
   * Creates a new RTBNext SDK instance.
   * 
   * @param options - Configuration options for the SDK.
   */
  constructor ( options: RTBNextOptions ) {
    this.httpClient = new HttpClient( {
      baseUrl: options.baseUrl ?? DEFAULT_OPTIONS.baseUrl,
      sdkVersion: DEFAULT_OPTIONS.sdkVersion,
      client: options.client,
      limiter: DEFAULT_OPTIONS.limiter,
      timeout: options.httpTimeout ?? DEFAULT_OPTIONS.httpTimeout
    } );

    this.resourceLoader = ResourceLoader.getInstance( this.httpClient, {
      ...DEFAULT_OPTIONS.cache, ...options.cache
    } );

    const endpoints = {} as Endpoints;

    this.profile = new Profile( this.resourceLoader, endpoints );
    this.list = new List( this.resourceLoader, endpoints );
    this.mover = new Mover( this.resourceLoader, endpoints );
    this.filter = new Filter( this.resourceLoader, endpoints );
    this.stats = new Stats( this.resourceLoader, endpoints );
    this.system = new System( this.resourceLoader, endpoints );

    endpoints.profile = this.profile;
    endpoints.list = this.list;
    endpoints.mover = this.mover;
    endpoints.filter = this.filter;
    endpoints.stats = this.stats;
    endpoints.system = this.system;

    this.endpoints = Object.freeze( endpoints );
  }
}
