import type { Filter } from '../endpoint/Filter';
import type { List } from '../endpoint/List';
import type { Mover } from '../endpoint/Mover';
import type { Profile } from '../endpoint/Profile';
import type { Stats } from '../endpoint/Stats';
import type { System } from '../endpoint/System';


// --- endpoints ---

/** Endpoints available in the RTBNext SDK. */
export interface Endpoints {
  /** The Profile endpoint. */
  profile: Profile;
  /** The List endpoint. */
  list: List;
  /** The Mover endpoint. */
  mover: Mover;
  /** The Filter endpoint. */
  filter: Filter;
  /** The Stats endpoint. */
  stats: Stats;
  /** The System endpoint. */
  system: System;
}
