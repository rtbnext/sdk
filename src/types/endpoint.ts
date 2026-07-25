import type { TDBStats, TGlobalStats, TProfileStats, TWealthStats } from '@rtbnext/schema/src/model/stats';
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

export type DBStats = Resource< TDBStats >;
export type GlobalStats = Resource< TGlobalStats >;
export type ProfileStats = Resource< TProfileStats >;
export type WealthStats = Resource< TWealthStats >;

export interface IStats {
  readonly db: DBStats;
  readonly global: GlobalStats;
  readonly profile: ProfileStats;
  readonly wealth: WealthStats;
}

// --- system ---

export type SystemStatus = Resource< TStatus >;

export interface ISystem {
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
