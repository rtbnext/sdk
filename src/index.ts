import { RTBNext } from './RTBNext';
import type { RTBNextOptions } from './types';

export type * from './types';

const rtbnext = ( options: RTBNextOptions ) => Object.freeze( new RTBNext( options ) );

export { RTBNext, rtbnext };
export default rtbnext;
