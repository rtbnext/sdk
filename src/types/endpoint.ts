import type { TStatus } from '@rtbnext/schema/src/model/status';

import type { Resource } from '../resource/Resource';


// --- profile ---

export interface IProfile {}

// --- list ---

export interface IList {}

// --- mover ---

export interface IMover {}

// --- filter ---

export interface IFilter {}

// --- stats ---

export interface IStats {}

// --- system ---

/** The system status resource. */
export type SystemStatus = Resource< TStatus >;

/** The system endpoint interface. */
export interface ISystem {
  /** System status resource. */
  readonly status: SystemStatus;
}

// --- endpoints ---

/** Endpoints available in the RTBNext SDK. */
export interface Endpoints {
  /** The Profile endpoint. */
  profile: IProfile;
  /** The List endpoint. */
  list: IList;
  /** The Mover endpoint. */
  mover: IMover;
  /** The Filter endpoint. */
  filter: IFilter;
  /** The Stats endpoint. */
  stats: IStats;
  /** The System endpoint. */
  system: ISystem;
}
