import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import type { TListIndex, TListIndexItem, TListItem, TListSnapshot } from '@rtbnext/schema/src/model/list';
import type { TMover } from '@rtbnext/schema/src/model/mover';
import type {
  TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem,
  TProfileMetaData
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
import type { Entity } from './resource';


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
export type ProfileEntity< I extends { uri: string } > = Entity< I, ProfileResources >;

/** A collection of profile entities keyed by URI. */
export type ProfileCollection< D extends { items: I[] }, I extends { uri: string } > = CollectableResource< D, I, ProfileEntity< I > >;

/** The index resource for profiles. */
export type ProfileIndex = ProfileCollection< TProfileIndex, TProfileIndexItem >;

/** A search index of profiles. */
export type SearchIndex = ProfileCollection< TSearchIndex, TSearchIndexItem >;

/** The profile endpoint surface. */
export interface IProfile {
  /** Retrieve profile metadata by URI. */
  meta ( uri: string ) : ProfileMeta;
  /** Retrieve full profile data by URI. */
  data ( uri: string ) : ProfileData;
  /** Retrieve profile history by URI. */
  history ( uri: string ) : ProfileHistory;
  /** Retrieve a profile entity by URI. */
  get ( uri: string ) : ProfileEntity< { uri: string } >;
  /** The profile index resource. */
  readonly index: ProfileIndex;
  /** The search index for profiles. */
  readonly searchIndex: SearchIndex;
}

// --- list ---

export type ListEntity< T extends TListItem & { uri: string } > = TListIndexItem & { dates: ListDateIndex< T > };
export type ListSnapshot< T extends TListItem & { uri: string } > = CollectableResource< TListSnapshot< T >, T, ProfileEntity< T > >;
export type ListDateIndex< T extends TListItem & { uri: string } > = DateableResource< TSnapshotIndex, ListSnapshot< T > >;
export type ListIndex = CollectableResource< TListIndex, TListIndexItem, ListEntity< any > >;

export interface IList {
  snapshot < T extends TListItem & { uri: string } > ( uri: string, date: string ) : ListSnapshot< T >;
  get < T extends TListItem & { uri: string } > ( uri: string ) : ListDateIndex< T >;
  readonly index: ListIndex;
}

// --- mover ---

export type MoverSnapshot = Resource< TMover >;
export type MoverIndex = DateableResource< TSnapshotIndex, MoverSnapshot >;

export interface IMover {
  snapshot ( date: string ) : MoverSnapshot;
  readonly index: MoverIndex;
}

// --- filter ---

export type FilterCollection = CollectableResource< TFilter, TFilterItem, ProfileEntity< TFilterItem > >;
export type FilterIndex = IndexableResource< TFilter, FilterCollection >;

export interface IFilter {
  readonly deceased: FilterCollection;
  readonly dropOff: FilterCollection;
  readonly family: FilterCollection;
  readonly selfMade: FilterCollection;
  industry ( industry: TIndustry ) : FilterCollection;
  age ( ageGroup: TAgeGroup ) : FilterCollection;
  gender ( gender: TGender ) : FilterCollection;
  maritalStatus ( maritalStatus: TMaritalStatus ) : FilterCollection;
  citizenship ( isoCode: string ) : FilterCollection;
  country ( isoCode: string ) : FilterCollection;
  state ( uspsCode: string ) : FilterCollection;
  readonly index: FilterIndex;
}

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
export type Scatter = CollectableResource< TScatter, TScatterItem, ProfileEntity< TScatterItem > >;
export type WealthStats = Resource< TWealthStats >;
export type StatsHistory = TimeSeriesResource< THistory, HistoryPoint >;
export type StatsGroup< T extends string > = IndexableResource< TStatsGroup< T >[ 'index' ], StatsHistory >;

export interface IStats {
  readonly db: DBStats;
  readonly global: GlobalStats;
  readonly profile: ProfileStats;
  readonly scatter: Scatter;
  readonly wealth: WealthStats;
  readonly history: StatsHistory;
  industry ( industry: TIndustry ) : StatsHistory;
  citizenship ( isoCode: string ) : StatsHistory;
  readonly industryIndex: StatsGroup< TIndustry >;
  readonly citizenshipIndex: StatsGroup< string >;
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
