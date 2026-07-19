import type { CacheStore } from '../types';
import { HttpClient } from './HttpClient';


export class CacheManager {
  private constructor (
    private readonly store: CacheStore | false,
    private readonly httpClient: HttpClient
  ) {}
}
