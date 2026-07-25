import type { Filter } from '../endpoint/Filter';
import type { List } from '../endpoint/List';
import type { Mover } from '../endpoint/Mover';
import type { Profile } from '../endpoint/Profile';
import type { Stats } from '../endpoint/Stats';
import type { System } from '../endpoint/System';


// --- endpoints ---

export interface Endpoints {
  profile: Profile;
  list: List;
  mover: Mover;
  filter: Filter;
  stats: Stats;
  system: System;
}
