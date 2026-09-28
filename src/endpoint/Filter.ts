import type { FilterCollection, FilterEndpoint } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';


/**
 * Endpoint implementation for filter resources.
 * 
 * Provides access to filter collections for special categories, demographics, and indices.
 */
export class Filter extends Endpoint implements FilterEndpoint {
  /**
   * Creates a filter collection using the profile endpoint's collection helper.
   * 
   * @param path - The filter resource path.
   * @returns The filter collection.
   */
  protected filter ( path: string ) : FilterCollection {
    return useProfile( this.endpoints.profile ).collect( path );
  }
}
