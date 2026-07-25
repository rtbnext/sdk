import type { Cache } from '../types/core';


/**
 * A cache implementation that does not store any data.
 * 
 * All `get` operations return `null`, and all `set`, `delete`, and `clear` operations are no-ops.
 * This can be used when caching is not desired or when a cache implementation is not available.
 */
export class EmptyCache implements Cache {
  public get size () : number { return 0 }
  public async get () : Promise< null > { return null }
  public async set () : Promise< void > {}
  public async delete () : Promise< void > {}
  public async clear () : Promise< void > {}
}
