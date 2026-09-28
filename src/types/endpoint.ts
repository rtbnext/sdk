import type { TStatus } from '@rtbnext/schema/src/model/status';

import type { Resource } from '../resource/Resource';


// --- profile ---

export interface ProfileEndpoint {}


// --- list ---

export interface ListEndpoint {}


// --- mover ---

export interface MoverEndpoint {}


// --- filter ---

export interface FilterEndpoint {}


// --- stats ---

export interface StatsEndpoint {}


// --- system ---

/** The system status resource. */
export type SystemStatus = Resource< TStatus >;

/** The system endpoint interface. */
export interface SystemEndpoint {
  /** System status resource. */
  readonly status: SystemStatus;
}


// --- endpoints ---

/** Endpoints available in the RTBNext SDK. */
export interface Endpoints {
  /** The Profile endpoint. */
  profile: ProfileEndpoint;
  /** The List endpoint. */
  list: ListEndpoint;
  /** The Mover endpoint. */
  mover: MoverEndpoint;
  /** The Filter endpoint. */
  filter: FilterEndpoint;
  /** The Stats endpoint. */
  stats: StatsEndpoint;
  /** The System endpoint. */
  system: SystemEndpoint;
}
