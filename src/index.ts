import { RTBNext } from './RTBNext';
import type { RTBNextOptions } from './types/core';

export type * from './types/core';
export type * from './types/endpoint';

const rtbnext = ( options: RTBNextOptions ) => new RTBNext( options );

export { RTBNext, rtbnext };
export default rtbnext;
