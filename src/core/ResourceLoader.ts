import type { CacheMode } from '../types/core';
import type { HttpClient } from './HttpClient';


export class ResourceLoader {
  private constructor (
    private readonly cache: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}
}
