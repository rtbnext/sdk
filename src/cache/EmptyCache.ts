import type { Cache } from '../types/core';


/**
 * Cache implementation that never stores any data.
 * 
 * All read operations return `null`, while write operations are ignored.
 * Used for disabling caching without changing the SDK's cache interface.
 */
export class EmptyCache implements Cache {
  public get size () : number { return 0 }
  public async get () : Promise< null > { return null }
  public async set () : Promise< void > {}
  public async delete () : Promise< void > {}
  public async clear () : Promise< void > {}
}
