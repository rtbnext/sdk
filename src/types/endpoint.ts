import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TDBStats, TGlobalStats, THistory, TProfileStats, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { TStatus } from '@rtbnext/schema/src/model/status';
import type { Resource } from '../resource/Resource';
import type { TimeSeriesResource } from '../resource/TimeSeriesResource';


// --- profile ---

export interface IProfile {}

// --- list ---

export interface IList {}

// --- mover ---

export interface IMover {}

// --- filter ---

export interface IFilter {}

// --- stats ---

export type HistoryPoint = {
  date: string;
  count: number;
  total: number;
  woman: number;
  quota: number;
  change: number;
  changePct: number;
};

export type DBStats = Resource< TDBStats >;
export type GlobalStats = Resource< TGlobalStats >;
export type ProfileStats = Resource< TProfileStats >;
export type WealthStats = Resource< TWealthStats >;
export type StatsHistory = TimeSeriesResource< THistory, HistoryPoint >;

export interface IStats {
  readonly db: DBStats;
  readonly global: GlobalStats;
  readonly profile: ProfileStats;
  readonly wealth: WealthStats;
  readonly history: StatsHistory;
  industry ( industry: TIndustry ) : StatsHistory;
  citizenship ( isoCode: string ) : StatsHistory;
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
