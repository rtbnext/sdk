import type { ListEndpoint } from '../types/endpoint';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for list resources.
 * 
 * Provides access to item snapshots, date-indexed list resources, and the list index.
 */
export class List extends Endpoint implements ListEndpoint {}
