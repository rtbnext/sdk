import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import { collection } from '../core/Collection';
import type { CollectableResource } from '../resource/CollectableResource';
import type { Resource } from '../resource/Resource';
import type { Collection, CollectionSearchFn, ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public _entity < T > ( item: T & { uri: string } ) : ProfileEntity< T > {
    const self = this;

    let meta: Resource< TProfileMetaData >;
    let data: Resource< TProfileData >;
    let history: Resource< TProfileHistory >;
  
    return Object.freeze( { ...item,
      get meta () { return meta ??= self.meta( item.uri ) },
      get data () { return data ??= self.data( item.uri ) },
      get history () { return history ??= self.history( item.uri ) }
    } );
  }

  public _collect < T extends { uri: string } > ( items: T[], search: CollectionSearchFn< T > ) : Collection< T > {
    return collection( items.map( i => this._entity( i ) ), search );
  }

  public meta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json( `v2/profile/${ uri }/meta.json` );
  }

  public data ( uri: string ) : Resource< TProfileData > {
    return this.json( `v2/profile/${ uri }/profile.json` );
  }

  public history ( uri: string ) : Resource< TProfileHistory > {
    return this.csv( `v2/profile/${ uri }/history.csv` );
  }

  public index () : CollectableResource< TProfileIndex, Collection< TProfileIndexItem > > {
    return this.json( 'v2/profile/index.json', data =>
      this._collect( data.items, ( item, query, terms ) => {
        const name = sanitize( item.name );

        return (
          name.includes( query ) || item.text.includes( query ) ||
          terms.every( t => name.includes( t ) || item.text.includes( t ) )
        );
      } )
    );
  }

  public search () : CollectableResource< TSearchIndex, Collection< TSearchIndexItem > > {
    return this.json( 'v2/profile/search.json', data =>
      this._collect( data.items, ( item, query, terms ) =>
        item.searchName.includes( query ) ||
        terms.every( t => item.searchName.includes( t ) )
      )
    );
  }
}
