import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TMover } from '@rtbnext/schema/src/model/mover';
import type {
  TProfileData, TProfileHistory, TProfileIndex,
  TProfileIndexItem, TProfileMetaData
} from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { TStatus } from '@rtbnext/schema/src/model/status';

import type { CollectableResource } from '../resource/CollectableResource';
import type { DateableResource } from '../resource/DateableResource';
import type { Resource } from '../resource/Resource';
import type { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { CollectData, CollectItem, Entity } from './collection';


// --- profile ---

/** A single point in a profile's historical timeline. */
export interface ProfileHistoryPoint {
  /** The ISO date of the history point. */
  date: string;
  /** The profile's rank on that date. */
  rank: number;
  /** The profile's net worth at that date. */
  networth: number;
  /** The change in net worth since the prior date. */
  change: number;
  /** The percentage change in net worth since the prior date. */
  changePct: number;
}

/** Metadata for a profile resource. */
export type ProfileMeta = Resource< TProfileMetaData >;

/** Full profile data resource. */
export type ProfileData = Resource< TProfileData >;

/** Historical time series resource for profile data. */
export type ProfileHistory = TimeSeriesResource< TProfileHistory, ProfileHistoryPoint >;

export interface ProfileEndpoint {}


// --- list ---

export interface ListEndpoint {}


// --- mover ---

/** A single mover snapshot resource. */
export type MoverSnapshot = Resource< TMover >;

/** A date-indexed mover resource. */
export type MoverIndex = DateableResource< TSnapshotIndex, MoverSnapshot >;

/** The mover endpoint interface. */
export interface MoverEndpoint {
  /** Retrieve a mover snapshot for a given date. */
  snapshot ( date: string ) : MoverSnapshot;
  /** The mover index resource. */
  readonly index: MoverIndex;
}


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
