import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TMover } from '@rtbnext/schema/src/model/mover';
import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TDBStats, TGlobalStats, THistory, TProfileStats, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { TStatus } from '@rtbnext/schema/src/model/status';
import type { CollectableResource } from '../resource/CollectableResource';
import type { DateableResource } from '../resource/DateableResource';
import type { Resource } from '../resource/Resource';
import type { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { Entity } from './resource';


// --- profile ---

export interface ProfileHistoryPoint {
  date: string;
  rank: number;
  networth: number;
  change: number;
  changePct: number;
}

export type ProfileMeta = Resource< TProfileMetaData >;
export type ProfileData = Resource< TProfileData >;
export type ProfileHistory = TimeSeriesResource< TProfileHistory, ProfileHistoryPoint >;

export interface ProfileResources {
  readonly meta: ProfileMeta;
  readonly data: ProfileData;
  readonly history: ProfileHistory;
}

export type ProfileEntity< I extends { uri: string } > = Entity< I, ProfileResources >;
export type ProfileCollection< D extends { items: I[] }, I extends { uri: string } > = CollectableResource< D, I, ProfileEntity< I > >;

export interface IProfile {}

// --- list ---

export interface IList {}

// --- mover ---

export type MoverSnapshot = Resource< TMover >;
export type MoverIndex = DateableResource< TSnapshotIndex, MoverSnapshot >;

export interface IMover {
  snapshot ( date: string ) : MoverSnapshot;
  readonly index: MoverIndex;
}

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
