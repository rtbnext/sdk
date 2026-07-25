import type { ISystem, SystemStatus } from '../types/endpoint';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for system resources.
 * 
 * Provides access to system status information.
 */
export class System extends Endpoint implements ISystem {
  /** Returns the current system status resource. */
  public get status () : SystemStatus {
    return this.json( 'v2/system/status.json' );
  }
}
