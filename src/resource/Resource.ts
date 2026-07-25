import type { ResourceState } from '../types/core';


export class Resource< D > {
  protected loaded: boolean = false;
  protected loading?: Promise< void >;
  protected state?: ResourceState;

  protected parsed: boolean = false;
  protected value?: D;
}
