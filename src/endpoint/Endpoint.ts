import type { ResourceLoader } from '../core/ResourceLoader';
import type { Endpoints } from '../types';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}
}
