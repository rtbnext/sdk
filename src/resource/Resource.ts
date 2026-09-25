import type { ResourceState } from '../types/core';


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
}
