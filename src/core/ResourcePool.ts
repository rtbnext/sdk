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

  /**
   * Returns an existing valid resource or creates and stores a new instance.
   * 
   * @template R - The resource type to return.
   * @param path - The unique resource path used as cache key.
   * @param factory - Factory function used to create a new resource instance.
   * @returns The existing valid or newly created resource instance.
   */
  public get < R extends Resource< any > > ( path: string, factory: () => R ) : R {
    const existing = this.resources.get( path ) as R;
    if ( existing && existing.valid ) return existing;

    const resource = factory();
    this.resources.set( path, resource );

    return resource;
  }

  /** Returns the number of resource instances currently stored. */
  public get size () : number {
    return this.resources.size;
  }

  /** Removes all stored resource instances. */
  public clear () : void {
    this.resources.clear();
  }
}
