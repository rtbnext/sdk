import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, ResourceState } from '../types/core';


export class Resource< D > {
  protected loaded: boolean = false;
  protected loading?: Promise< void >;
  protected state?: ResourceState;

  protected parsed: boolean = false;
  protected value?: D;

  constructor (
    protected readonly path: string,
    protected readonly loader: ResourceLoader,
    protected readonly parser: ParserFn< D >
  ) {}
}
