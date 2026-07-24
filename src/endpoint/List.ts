import type { TSnapshotIndex } from '@rtbnext/schema/src/base/generic';
import type { TListIndex, TListIndexItem, TListItem, TListSnapshot } from '@rtbnext/schema/src/model/list';
import type { CollectableResource } from '../resource/CollectableResource';
import type { DateableResource } from '../resource/DateableResource';
import type { ProfileEntity } from '../types';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';


type ListEntity< T extends TListItem & { uri: string } > = TListIndexItem & { dates: ListDateIndex< T > };
type ListSnapshot< T extends TListItem & { uri: string } > = CollectableResource< TListSnapshot< T >, T, ProfileEntity< T > >;
type ListDateIndex< T extends TListItem & { uri: string } > = DateableResource< TSnapshotIndex, ListSnapshot< T > >;
type ListIndex = CollectableResource< TListIndex, TListIndexItem, ListEntity< any > >;


export class List extends Endpoint {
  public _entity < T extends TListItem & { uri: string } > ( item: TListIndexItem ) : ListEntity< T > {
    return { ...item, dates: this.get( item.uri ) };
  }

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

  public get index () : ListIndex {
    return this.json( 'v2/list/index.json', {
      entity: item => ( { ...item, dates: this.get( item.uri ) } ),
      search: ( item, query, terms ) => {
        const name = sanitize( item.name );

        return (
          name.includes( query ) || item.text.includes( query ) ||
          terms.every( t => name.includes( t ) || item.text.includes( t ) )
        );
      }
    } );
  }
}
