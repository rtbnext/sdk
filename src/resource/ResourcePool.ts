import type { Resource } from '../resource/Resource';


/**
 * Stores and reuses resource instances by their resource path.
 * 
 * The resource pool prevents duplicate wrapper instances while respecting
 * resource validity. Invalid resources are replaced with newly created ones.
 */
export class ResourcePool {
  /** Cached resource instances indexed by their resource path. */
  private readonly resources = new Map< string, unknown >();
}
