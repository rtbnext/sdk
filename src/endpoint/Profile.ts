import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { CollectableResource } from '../resource/CollectableResource';
import type { Resource } from '../resource/Resource';
import type { CollectionSearchFn, ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public _entity < I extends { uri: string } > ( item: I ) : ProfileEntity< I > {
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

  public _collect < I extends { uri: string }, D extends { items: I[] } > (
    path: string, search: CollectionSearchFn< I >
  ) : CollectableResource< D, I, ProfileEntity< I > > {
    return this.json( path, { entity: item => this._entity( item ), search } );
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

  public get ( uri: string ) : ProfileEntity< { uri: string } > {
    return this._entity( { uri } );
  }

  public get index () : CollectableResource< TProfileIndex, TProfileIndexItem, ProfileEntity< TProfileIndexItem > > {
    return this._collect( 'v2/profile/index.json', ( item, query, terms ) => {
      const name = sanitize( item.name );

      return (
        name.includes( query ) || item.text.includes( query ) ||
        terms.every( t => name.includes( t ) || item.text.includes( t ) )
      );
    } );
  }

  public get searchIndex () : CollectableResource< TSearchIndex, TSearchIndexItem, ProfileEntity< TSearchIndexItem > > {
    return this._collect( 'v2/profile/search.json', ( item, query, terms ) =>
      item.searchName.includes( query ) || terms.every( t => item.searchName.includes( t ) )
    );
  }
}
