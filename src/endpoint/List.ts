import type { TListItem } from '@rtbnext/schema/src/model/list';
import type { IList, ListDateIndex, ListIndex, ListSnapshot } from '../types/endpoint';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


export class List extends Endpoint implements IList {
  public snapshot < T extends TListItem & { uri: string } > ( uri: string, date: string ) : ListSnapshot< T > {
    return profileProvider( this.endpoints.profile ).collect(
      `v2/list/${ sanitize( uri ) }/${ ymd( date ) }.json`
    );
  }

  public get < T extends TListItem & { uri: string } > ( uri: string ) : ListDateIndex< T > {
    return this.json( `v2/list/${ sanitize( uri ) }/index.json`, {
      date: ( value: string ) => this.snapshot< T >( uri, value )
    } );
  }

  public get index () : ListIndex {
    return this.json( 'v2/list/index.json', {
      entity: item => ( { ...item, dates: this.get( item.uri ) } )
    } );
  }
}
