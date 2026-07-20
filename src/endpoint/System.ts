import type { TStatus } from '@rtbnext/schema/src/model/status';
import type { Resource } from '../core/Resource';
import type { RequestOptions } from '../types';
import { Endpoint } from './Endpoint';


export class System extends Endpoint {
  public async status ( options?: RequestOptions ) : Promise< Resource< TStatus > > {
    return await this.json< TStatus >( 'system/status.json', options );
  }
}
