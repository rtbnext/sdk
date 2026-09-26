import type { ISystem } from '../types/endpoint';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for system resources.
 * 
 * Provides access to system status information.
 */
export class System extends Endpoint implements ISystem {}
