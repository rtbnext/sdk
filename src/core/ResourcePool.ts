import type { Resource } from '../resource/Resource';
import type { ResourceLoader } from './ResourceLoader';


export class ResourcePool {
  private readonly resources = new Map< string, Resource< any > >();

  constructor (
    private readonly loader: ResourceLoader
  ) {}
}
