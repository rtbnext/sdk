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

export interface IProfile {}

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
