import type { CacheManager } from '../core/CacheManager';


export abstract class Endpoint {
  constructor ( protected readonly cache: CacheManager ) {}
}
