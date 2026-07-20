import { CacheManager } from './CacheManager';


export class Resource< T > {
  private readonly hooks = new Map< string, Set< ( ...args: unknown[] ) => void > >();

  constructor (
    private readonly path: string,
    private readonly cache: CacheManager,
    private readonly parser: any
  ) {}
}
