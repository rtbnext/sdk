import type { Resource } from '../resource/Resource';


export class ResourcePool {
  private readonly resources = new Map< string, Resource< any > >();
}
