import type { Resource } from '../resource/Resource';


export class ResourcePool {
  private readonly resources = new Map< string, unknown >();

  public get < R extends Resource< any > > ( path: string, factory: () => R ) : R {
    const existing = this.resources.get( path ) as R;
    if ( existing && existing.valid ) return existing;

    const resource = factory();
    this.resources.set( path, resource );
    return resource;
  }

  public get size () : number {
    return this.resources.size;
  }

  public clear () : void {
    this.resources.clear();
  }
}
