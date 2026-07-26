import type { Resource } from '../resource/Resource';


export class ResourcePool {
  private readonly resources = new Map< string, Resource< any > >();

  public get< D > ( path: string, factory: () => Resource< D > ) : Resource< D > {
    const existing = this.resources.get( path );
    if ( existing ) return existing;

    const resource = factory();
    this.resources.set( path, resource );
    return resource;
  }
}
