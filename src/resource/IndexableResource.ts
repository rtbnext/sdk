import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types/core';
import type { IndexFn, IndexOptions, IndexResult, KeysFn, ResourceTree } from '../types/resource';
import { Resource } from './Resource';


/** Default key extractor for indexable resources. */
const defaultKeys: KeysFn = value => {
  if ( Array.isArray( value ) ) return value.map( String );

  if ( value && typeof value === 'object' && 'items' in value && value.items && typeof value.items === 'object' )
    return Object.keys( value.items as object );

  return null;
};


/**
 * A resource wrapper for nested indexable endpoints.
 * 
 * This class provides lazy index traversal using generated accessor properties.
 * 
 * @template D - The raw data type of the resource.
 * @template R - The type of individual resources returned by the index factory function.
 */
export class IndexableResource< D, R > extends Resource< D > {
  /** Factory that resolves a nested path to a resource. */
  private readonly factory: IndexFn< R >;
  /** Optional custom key extractor for index traversal. */
  private readonly keys: KeysFn;

  /**
   * Creates a new instance of `IndexableResource`.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param options - Configuration options for index traversal and resource resolution.
   */
  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: IndexOptions< R > ) {
    super( path, loader, parser );

    this.factory = options.index;
    this.keys = options.keys ?? defaultKeys;
  }

  /**
   * Builds a frozen object with deferred property access for each index key.
   * 
   * @param keys - The keys to expose.
   * @param path - The current resource path prefix.
   * @returns An object mapping keys to lazily resolved sub-resources.
   */
  private createIndex ( keys: readonly string[], path: string[] ) : ResourceTree {
    const out: Record< string, unknown > = {};

    for ( const key of keys ) Object.defineProperty( out, key, {
      enumerable: true, configurable: false,
      get: () => this.factory( [ ...path, key ] )
    } );

    return Object.freeze( out );
  }

  /**
   * Traverses the parsed index structure and converts it into a nested accessor tree.
   * 
   * @param value - The parsed index payload.
   * @param path - The current traversal path.
   * @returns The lazily traversable index result.
   */
  private traverse ( value: unknown, path: string[] = [] ) : unknown {
    const keys = this.keys( value );
    if ( keys ) return this.createIndex( keys, path );

    if ( value && typeof value === 'object' ) {
      const out: Record< string, unknown > = {};

      for ( const [ key, child ] of Object.entries( value ) ) {
        if ( key === '$metadata' ) continue;

        Object.defineProperty( out, key, {
          enumerable: true, configurable: false,
          get: () => this.traverse( child, [ ...path, key ] )
        } );
      }

      return Object.freeze( out );
    }

    return undefined;
  }

  /**
   * Returns the lazily indexed resource tree for the parsed data.
   * 
   * @returns The nested index result.
   */
  public get () : Promise< IndexResult< D, R > > {
    return this.transform( data => this.traverse( data ) as IndexResult< D, R > );
  }
}
