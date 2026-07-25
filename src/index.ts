/**
 * RTBNext SDK
 * 
 * Official JavaScript/TypeScript SDK for the RTBNext API.
 * 
 * This package generates a fully typed SDK for the RTBNext API, including all endpoints,
 * resources, and data structures. It provides a convenient interface for making API requests,
 * handling responses, and managing resource state with caching and lazy loading.
 * 
 * The SDK is designed to be used in both Node.js and browser environments, and supports
 * modern JavaScript features such as async/await, Promises, and ES modules. It also
 * includes built-in support for caching, revalidation, and conditional requests to optimize
 * network usage.
 * 
 * Endpoints get enriched with collections, indexes and time series data for easy access
 * to the underlying data. It allows for a fast, efficient, and type-safe way to interact
 * with the RTBNext API reducing boilerplate code and improving developer productivity.
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
const rtbnext = ( options: RTBNextOptions ) => new RTBNext( options );

// --- define export ---

export { RTBNext, rtbnext };
export default rtbnext;
