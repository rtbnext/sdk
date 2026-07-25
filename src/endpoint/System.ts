import type { ISystem, SystemStatus } from '../types/endpoint';
import { Endpoint } from './Endpoint';


export class System extends Endpoint implements ISystem {
  public get status () : SystemStatus {
    return this.json( 'v2/system/status.json' );
  }
}
