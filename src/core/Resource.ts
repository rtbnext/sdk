import type { ResourceLoader } from './ResourceLoader';


export class Resource< T > {
  private readonly hooks = new Map< string, Set< ( ...args: unknown[] ) => void > >();

  constructor (
    private readonly path: string,
    private readonly loader: ResourceLoader,
    private readonly parser: any
  ) {}
}
