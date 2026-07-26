/**
 * RTBNext SDK
 * 
 * Official JavaScript/TypeScript SDK for the RTBNext API.
 * 
 * Provides fully typed access to all RTBNext API endpoints, resources, and
 * data models. The SDK offers lazy loading, transparent caching, automatic
 * revalidation, and a resource-oriented API for working with lists, profiles,
 * filters, statistics, and time series data.
 * 
 * Designed for both Node.js and modern browsers, it leverages native
 * `fetch()`, Promises, async/await, and ES modules while providing a concise,
 * type-safe developer experience with minimal boilerplate.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import { RTBNext } from './RTBNext';
import type { RTBNextOptions } from './types/core';

// --- export types ---

export type * from './types/core';
export type * from './types/endpoint';
export type * from './types/resource';

// --- create SDK instance ---

/**
 * Creates a new RTBNext SDK instance.
 * 
 * @param options - RTBNext SDK configuration options.
 * @returns A configured RTBNext SDK instance.
 */
const rtbnext = ( options: RTBNextOptions ) : RTBNext => new RTBNext( options );

// --- define export ---

export { RTBNext, rtbnext };
export default rtbnext;
