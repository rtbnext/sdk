import type { CacheStore } from '../types';
import type { HttpClient } from './HttpClient';


export class CacheManager {
  public constructor (
    private readonly store: CacheStore,
    private readonly client: HttpClient
  ) {}
}
