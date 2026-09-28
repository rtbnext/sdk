import type { FilterEndpoint } from '../types/endpoint';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for filter resources.
 * 
 * Provides access to filter collections for special categories, demographics, and indices.
 */
export class Filter extends Endpoint implements FilterEndpoint {}
