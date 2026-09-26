import { Resource } from '../resource/Resource';


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
   * @param path - The unique resource path used as cache key.
   * @param factory - Factory function used to create a new resource instance.
   * @returns The existing valid or newly created resource instance.
   */
  public get < R > ( path: string, factory: () => R ) : R {
    const existing = this.resources.get( path );
    if ( existing instanceof Resource && existing.valid ) return existing as R;

    const resource = factory();
    this.resources.set( path, resource );

    return resource;
  }

  /** Returns the number of resource instances currently stored. */
  public get size () : number {
    return this.resources.size;
  }

  /**
   * Removes a stored resource instance by its resource path.
   * 
   * @param path - The unique resource path used as cache key.
   */
  public delete ( path: string ) : void {
    this.resources.delete( path );
  }

  /** Removes all stored resource instances. */
  public clear () : void {
    this.resources.clear();
  }
}
