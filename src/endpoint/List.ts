import type { TListItem } from '@rtbnext/schema/src/model/list';

import type { CollectItem } from '../types/collection';
import type { ListEndpoint, ListSnapshot } from '../types/endpoint';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';


/**
 * Endpoint implementation for list resources.
 * 
 * Provides access to item snapshots, date-indexed list resources, and the list index.
 */
export class List extends Endpoint implements ListEndpoint {
  /** Returns a snapshot collection for a list URI at a specific date. */
  public snapshot < T extends TListItem & CollectItem > ( uri: string, date: string ) : ListSnapshot< T > {
    return useProfile( this.endpoints.profile ).collect(
      `v2/list/${ sanitize( uri ) }/${ ymd( date ) }.json`
    );
  }
}
