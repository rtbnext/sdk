import type { TListItem } from '@rtbnext/schema/src/model/list';

import type { ListDateIndex, ListEndpoint, ListIndex, ListItem, ListSnapshot } from '../types/endpoint';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';


/**
 * Endpoint implementation for list resources.
 * 
 * Provides access to item snapshots, date-indexed list resources, and the list index.
 */
export class List extends Endpoint implements ListEndpoint {
  /**
   * Returns a snapshot collection for a list URI at a specific date.
   * 
   * @template T - The type of list item.
   * @param uri - The URI of the list.
   * @param date - The date for which to retrieve the snapshot (in `YYYY-MM-DD` format).
   * @returns A `ListSnapshot` resource for the specified URI and date.
   */
  public snapshot < T extends TListItem = ListItem > ( uri: string, date: string ) : ListSnapshot< T > {
    return useProfile( this.endpoints.profile ).collect(
      `v2/list/${ sanitize( uri ) }/${ ymd( date ) }.json`
    );
  }

  /**
   * Returns a date-indexed list resource for a list URI.
   * 
   * @template T - The type of list item.
   * @param uri - The URI of the list.
   * @returns A `ListDateIndex` resource for the specified URI.
   */
  public get < T extends TListItem = ListItem > ( uri: string ) : ListDateIndex< T > {
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
