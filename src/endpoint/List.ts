import type { TListItem } from '@rtbnext/schema/src/model/list';
import type { IList, ListDateIndex, ListIndex, ListSnapshot } from '../types/endpoint';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


/**
 * Endpoint implementation for list resources.
 * 
 * Provides access to item snapshots, date-indexed list resources, and the list index.
 */
export class List extends Endpoint implements IList {
  /** Returns a snapshot collection for a list URI at a specific date. */
  public snapshot < T extends TListItem & { uri: string } > ( uri: string, date: string ) : ListSnapshot< T > {
    return profileProvider( this.endpoints.profile ).collect(
      `v2/list/${ sanitize( uri ) }/${ ymd( date ) }.json`
    );
  }

  /** Returns a date-indexed list resource for a list URI. */
  public get < T extends TListItem & { uri: string } > ( uri: string ) : ListDateIndex< T > {
    return this.json( `v2/list/${ sanitize( uri ) }/index.json`, {
      date: ( value: string ) => this.snapshot< T >( uri, value )
    } );
  }

  /** Returns the root list index resource. */
  public get index () : ListIndex {
    return this.json( 'v2/list/index.json', {
      entity: item => ( { ...item, dates: this.get( item.uri ) } )
    } );
  }
}
