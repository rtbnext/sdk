import type { TListItem } from '@rtbnext/schema/src/model/list';

import type { CollectItem } from '../types/collection';
import type { ListDateIndex, ListEndpoint, ListIndex, ListSnapshot } from '../types/endpoint';
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

  /** Returns a date-indexed list resource for a list URI. */
  public get < T extends TListItem & CollectItem > ( uri: string ) : ListDateIndex< T > {
    return this.dateable( `v2/list/${ sanitize( uri ) }/index.json`,
      value => this.snapshot< T >( uri, value )
    );
  }

  /** Returns the root list index resource. */
  public get index () : ListIndex {
    return this.collectable( 'v2/list/index.json',
      item => ( { ...item, dates: this.get( item.uri ) } )
    );
  }
}
