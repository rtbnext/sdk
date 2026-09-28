import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TFilter, TFilterIndex, TFilterItem } from '@rtbnext/schema/src/model/filter';
import type { TListIndex, TListIndexItem, TListItem, TListSnapshot } from '@rtbnext/schema/src/model/list';
import type { TMover } from '@rtbnext/schema/src/model/mover';
import type {
  TProfileData, TProfileHistory, TProfileIndex,
  TProfileIndexItem, TProfileMetaData
} from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type {
  TDBStats, TGlobalStats, THistory, TProfileStats, TScatter,
  TScatterItem, TStatsGroup, TWealthStats
} from '@rtbnext/schema/src/model/stats';
import type { TStatus } from '@rtbnext/schema/src/model/status';

import type { CollectableResource } from '../resource/CollectableResource';
import type { DateableResource } from '../resource/DateableResource';
import type { IndexableResource } from '../resource/IndexableResource';
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

/** Resources exposed by a profile entity. */
export interface ProfileResources {
  /** Metadata for the profile. */
  readonly meta: ProfileMeta;
  /** Core profile data. */
  readonly data: ProfileData;
  /** Historical profile values. */
  readonly history: ProfileHistory;
}

/**
 * A profile entity with its associated resources.
 * 
 * @template I - The type of collectable item.
 */
export type ProfileEntity< I extends CollectItem > = Entity< I, ProfileResources >;

/**
 * A collection of profile entities keyed by URI.
 * 
 * @template D - The type of collectable data.
 * @template I - The type of collectable item.
 */
export type ProfileCollection< D extends CollectData< I >, I extends CollectItem > =
  CollectableResource< D, I, ProfileEntity< I > >;

/** The index resource for profiles. */
export type ProfileIndex = ProfileCollection< TProfileIndex, TProfileIndexItem >;

/** A search index of profiles. */
export type SearchIndex = ProfileCollection< TSearchIndex, TSearchIndexItem >;

/** The profile endpoint interface. */
export interface ProfileEndpoint {
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

/**
 * A list entity that includes date-indexed snapshots.
 * 
 * @template T - The type of list item.
 */
export type ListEntity< T extends TListItem & CollectItem > = TListIndexItem & {
  /** The date-indexed snapshots for the list entity. */
  dates: ListDateIndex< T >;
};

/**
 * A snapshot collection for list data.
 * 
 * @template T - The type of list item.
 */
export type ListSnapshot< T extends TListItem & CollectItem > =
  CollectableResource< TListSnapshot< T >, T, ProfileEntity< T > >;

/**
 * A date-indexed list of snapshots.
 * 
 * @template T - The type of list item.
 */
export type ListDateIndex< T extends TListItem & CollectItem > =
  DateableResource< TSnapshotIndex, ListSnapshot< T > >;

/** The list index resource. */
export type ListIndex = CollectableResource< TListIndex, TListIndexItem, ListEntity< any > >;

/** The list endpoint interface. */
export interface ListEndpoint {
  /** Retrieve a list snapshot for a URI and date. */
  snapshot < T extends TListItem & CollectItem > ( uri: string, date: string ) : ListSnapshot< T >;
  /** Retrieve a date-indexed list resource for a URI. */
  get < T extends TListItem & CollectItem > ( uri: string ) : ListDateIndex< T >;
  /** The list index resource. */
  readonly index: ListIndex;
}


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

/** A collection of filter items. */
export type FilterCollection = CollectableResource< TFilter, TFilterItem, ProfileEntity< TFilterItem > >;

/** A filter index resource. */
export type FilterIndex = IndexableResource< TFilterIndex, FilterCollection >;

/** The filter endpoint interface. */
export interface FilterEndpoint {
  /** Filter resource for deceased profiles. */
  readonly deceased: FilterCollection;
  /** Filter resource for drop-off profiles. */
  readonly dropOff: FilterCollection;
  /** Filter resource for family profiles. */
  readonly family: FilterCollection;
  /** Filter resource for self-made profiles. */
  readonly selfMade: FilterCollection;
  /** Retrieve a filter collection by industry. */
  industry ( industry: TIndustry ) : FilterCollection;
  /** Retrieve a filter collection by age group. */
  age ( ageGroup: TAgeGroup ) : FilterCollection;
  /** Retrieve a filter collection by gender. */
  gender ( gender: TGender ) : FilterCollection;
  /** Retrieve a filter collection by marital status. */
  maritalStatus ( maritalStatus: TMaritalStatus ) : FilterCollection;
  /** Retrieve a filter collection by citizenship ISO code. */
  citizenship ( isoCode: string ) : FilterCollection;
  /** Retrieve a filter collection by country ISO code. */
  country ( isoCode: string ) : FilterCollection;
  /** Retrieve a filter collection by USPS state code. */
  state ( uspsCode: string ) : FilterCollection;
  /** The root filter index resource. */
  readonly index: FilterIndex;
}


// --- stats ---

/** A point in a statistics time series. */
export interface HistoryPoint {
  /** The ISO date of the history point. */
  date: string;
  /** The total count of profiles at that date. */
  count: number;
  /** The total net worth of profiles at that date. */
  total: number;
  /** The woman count at that date. */
  woman: number;
  /** The woman quota at that date. */
  quota: number;
  /** The net worth change since the prior date. */
  change: number;
  /** The percentage change in net worth since the prior date. */
  changePct: number;
}

/** The database statistics resource. */
export type DBStats = Resource< TDBStats >;

/** The global statistics resource. */
export type GlobalStats = Resource< TGlobalStats >;

/** The profile statistics resource. */
export type ProfileStats = Resource< TProfileStats >;

/** A profile scatter statistics collection resource. */
export type Scatter = CollectableResource< TScatter, TScatterItem, ProfileEntity< TScatterItem > >;

/** The wealth statistics resource. */
export type WealthStats = Resource< TWealthStats >;

/** The stats history time series resource. */
export type StatsHistory = TimeSeriesResource< THistory, HistoryPoint >;

/** A grouped stats index resource. */
export type StatsGroup< T extends string > = IndexableResource< TStatsGroup< T >[ 'index' ], StatsHistory >;

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
