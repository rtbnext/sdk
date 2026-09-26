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
