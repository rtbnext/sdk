/**
 * RTBNext SDK
 * 
 * Official SDK entry point for the RTBNext API.
 * 
 * This package exposes the RTBNext client constructor and
 * typed API bindings for all supported endpoints.
 */

import { RTBNext } from './RTBNext';
import type { RTBNextOptions } from './types/core';

// --- export types ---

export type * from './types/core';
export type * from './types/endpoint';

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
