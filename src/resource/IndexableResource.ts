import type { StateLoader } from '../core/StateLoader';
import type { ParserFn } from '../types/core';
import type { IndexFn, IndexOptions, IndexResult, KeysFn, ResourceTree } from '../types/resource';
import { Resource } from './Resource';


/**
 * Default key extractor for indexable resources.
 * 
 * @param value - The value from which to extract keys.
 * @returns An array of keys, or null if no keys could be extracted.
 */
const defaultKeys = ( value: unknown ) : readonly string[] | null => {
  if ( Array.isArray( value ) ) return value.map( String );

  if ( value && typeof value === 'object' && ! Array.isArray( value ) && 'items' in value ) {
    const items = value.items;

    if ( items && typeof items === 'object' && ! Array.isArray( items ) )
      return Object.keys( items );
  }

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
   * Creates a new indexable resource.
   * 
   * @param path - The resource path relative to the API base URL.
   * @param loader - The resource state loader responsible for fetching and caching the resource.
   * @param parser - The parser function that converts raw HTTP responses into the expected data type.
   * @param options - Configuration options for index traversal and resource resolution.
   */
  public constructor ( path: string, loader: StateLoader, parser: ParserFn< D >, options: IndexOptions< R > ) {
    super( path, loader, parser );

    this.factory = options.index;
    this.keys = options.keys ?? defaultKeys;
  }
}
