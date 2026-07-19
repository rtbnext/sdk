import type { CacheManager } from '../core/CacheManager';


export abstract class Endpoint {
  protected constructor ( protected readonly cache: CacheManager ) {}
}
