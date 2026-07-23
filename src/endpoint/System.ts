import type { TStatus } from '@rtbnext/schema/src/model/status';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class System extends Endpoint {
  public status () : Resource< TStatus > {
    return this.json( 'v2/system/status.json' );
  }
}
