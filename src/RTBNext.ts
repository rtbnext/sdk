import { HttpClient } from './core/HttpClient';
import { StateLoader } from './core/StateLoader';
import { RTBNextOptions } from './types/core';


/**
 * Main entry point of the RTBNext SDK.
 * 
 * Provides access to all RTBNext API endpoints through a single client
 * instance while internally managing HTTP communication, resource loading,
 * caching, and endpoint initialization.
 */
export class RTBNext {
  /** The HTTP client used for all API requests. */
  public readonly httpClient: HttpClient;
  /** The state loader used for caching and fetching HTTP resources. */
  public readonly stateLoader: StateLoader;

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
  }
}
