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
import type { CollectData, CollectItem, Entity } from './resource';


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

/** Resources exposed by a profile entity. */
export interface ProfileResources {
  /** Metadata for the profile. */
  readonly meta: ProfileMeta;
  /** Core profile data. */
  readonly data: ProfileData;
  /** Historical profile values. */
  readonly history: ProfileHistory;
}

/** A profile entity with its associated resources. */
export type ProfileEntity< I extends CollectItem > = Entity< I, ProfileResources >;

/** A collection of profile entities keyed by URI. */
export type ProfileCollection< D extends CollectData< I >, I extends CollectItem > =
  CollectableResource< D, I, ProfileEntity< I > >;

/** The index resource for profiles. */
export type ProfileIndex = ProfileCollection< TProfileIndex, TProfileIndexItem >;

/** A search index of profiles. */
export type SearchIndex = ProfileCollection< TSearchIndex, TSearchIndexItem >;

/** The profile endpoint interface. */
export interface IProfile {
  /** Retrieve profile metadata by URI. */
  meta ( uri: string ) : ProfileMeta;
  /** Retrieve full profile data by URI. */
  data ( uri: string ) : ProfileData;
  /** Retrieve profile history by URI. */
  history ( uri: string ) : ProfileHistory;
  /** Retrieve a profile entity by URI. */
  get ( uri: string ) : ProfileEntity< CollectItem >;
  /** The profile index resource. */
  readonly index: ProfileIndex;
  /** The search index for profiles. */
  readonly searchIndex: SearchIndex;
}

// --- list ---

export interface IList {}

// --- mover ---

/** A single mover snapshot resource. */
export type MoverSnapshot = Resource< TMover >;

/** A date-indexed mover resource. */
export type MoverIndex = DateableResource< TSnapshotIndex, MoverSnapshot >;

/** The mover endpoint interface. */
export interface IMover {
  /** Retrieve a mover snapshot for a given date. */
  snapshot ( date: string ) : MoverSnapshot;
  /** The mover index resource. */
  readonly index: MoverIndex;
}

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
