import { Cache, CacheMode } from '../types';
import { HttpClient } from './HttpClient';


export class ResourceLoader {
  private constructor (
    private readonly store: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}
}
