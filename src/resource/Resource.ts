import { StateLoader } from '../core/StateLoader';
import type { ParserFn, ResourceState } from '../types/core';


/**
 * Base resource wrapper for lazy loading, parsing and cache state management.
 * 
 * This class implements loading a resource once, refreshing it on demand, and
 * parsing the HTTP response body through the configured parser.
 */
export class Resource< D > {
  /** Registered lifecycle event handlers for the resource. */
  protected readonly hooks = new Map< string, Set< ( self: this ) => void > >();

  /** Indicates whether the resource has been loaded at least once. */
  protected loaded = false;
  /** Promise tracking the current load operation, if one is in progress. */
  protected loading?: Promise< void >;
  /** The current cached resource state returned by the loader. */
  protected state?: ResourceState;
  /** Indicates whether the resource body has already been parsed. */
  protected parsed = false;
  /** The parsed resource value returned by `data()`. */
  protected value?: D;
  /** The transformed resource value returned by `transform()`. */
  protected transformed?: any | Promise< any >;

  /**
   * Creates a new resource wrapper.
   * 
   * @param path - The resource path for the API request.
   * @param loader - The resource state loader used to fetch and cache data.
   * @param parser - The parser function used to decode the response body.
   */
  constructor (
    protected readonly path: string,
    protected readonly loader: StateLoader,
    protected readonly parser: ParserFn< D >
  ) {}

  /**
   * Emits lifecycle events for this resource.
   * 
   * @param events - Event names to emit.
   */
  protected emit ( ...events: string[] ) : void {
    for ( const event of events ) this.hooks.get( event )?.forEach( handler => handler( this ) );
  }
}
