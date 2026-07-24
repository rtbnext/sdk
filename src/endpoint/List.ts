import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TListItem, TListSnapshot } from '@rtbnext/schema/src/model/list';
import type { CollectableResource } from '../resource/CollectableResource';
import type { DateableResource } from '../resource/DateableResource';
import type { ProfileEntity } from '../types';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';


type ListSnapshot< T extends TListItem & { uri: string } > = CollectableResource< TListSnapshot< T >, T, ProfileEntity< T > >;
type ListDateIndex< T extends TListItem & { uri: string } > = DateableResource< TSnapshotIndex, ListSnapshot< T > >;

export class List extends Endpoint {
  public snapshot < T extends TListItem & { uri: string } > ( uri: string, date: string ) : ListSnapshot< T > {
    return this.endpoints.profile._collect(
      `v2/list/${ sanitize( uri ) }/${ ymd( date ) }.json`, ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      }
    );
  }

  public get < T extends TListItem & { uri: string } > ( uri: string ) : ListDateIndex< T > {
    return this.json( `v2/list/${ sanitize( uri ) }/index.json`, {
      date: ( value: string ) => this.snapshot< T >( uri, value )
    } );
  }
}
