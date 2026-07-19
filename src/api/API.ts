import type { CacheManager } from '../core/CacheManager';


export abstract class API {
  protected constructor ( protected readonly cache: CacheManager, endpoints: any ) {}
}
