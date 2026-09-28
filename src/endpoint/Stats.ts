import type { StatsEndpoint } from '../types/endpoint';
import { Endpoint } from './Endpoint';


/**
 * Endpoint implementation for statistics resources.
 * 
 * Provides various stats resources, scatter collections, and grouped indices.
 */
export class Stats extends Endpoint implements StatsEndpoint {}
