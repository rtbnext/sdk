import type { SystemStatus } from '../types/endpoint';
import { Endpoint } from './Endpoint';


export class System extends Endpoint {
  public get status () : SystemStatus {
    return this.json( 'v2/system/status.json' );
  }
}
