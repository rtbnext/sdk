import type { TStatus } from '@rtbnext/schema/src/model/status';

import type { Resource } from '../resource/Resource';


// --- system ---


/** The system status resource. */
export type SystemStatus = Resource< TStatus >;

/** The system endpoint interface. */
export interface ISystem {
  /** System status resource. */
  readonly status: SystemStatus;
}

export interface Endpoints {}
