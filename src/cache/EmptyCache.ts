import type { Cache } from '../types/core';


export class EmptyCache implements Cache {
  public get size () : number { return 0 }
  public async get () : Promise< null > { return null }
  public async set () : Promise< void > {}
  public async delete () : Promise< void > {}
  public async clear () : Promise< void > {}
}
