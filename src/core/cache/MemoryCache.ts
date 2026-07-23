import type { Cache, ResourceState } from '../../types';


export class MemoryCache implements Cache {
  private readonly cache = new Map< string, ResourceState >();
  public get size () : number { return this.cache.size }

  public async get ( key: string ) : Promise< ResourceState | null > {
    return this.cache.get( key ) ?? null;
  }

  public async set ( key: string, value: ResourceState ) : Promise< void > {
    this.cache.set( key, value );
  }

  public async delete ( key: string ) : Promise< void > {
    this.cache.delete( key );
  }

  public async clear () : Promise< void > {
    this.cache.clear();
  }
}
