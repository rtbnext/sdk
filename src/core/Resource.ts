import type { HttpResponse } from '../types';
import { CacheManager } from './CachManager';
import { HttpClient } from './HttpClient';


export class Resource< T > {
  constructor (
    private readonly path: string,
    private readonly client: HttpClient,
    private readonly parser: ( res: HttpResponse ) => T,
    private readonly cache: CacheManager
  ) {}
}
