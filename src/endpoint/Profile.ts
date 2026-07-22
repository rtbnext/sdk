import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { CollectableResource, Resource } from '../core/Resource';
import { collection, profileEntity, sanitize } from '../core/utils';
import type { Collection } from '../types';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public meta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json< TProfileMetaData >( `v2/profile/${ uri }/meta.json` );
  }

  public data ( uri: string ) : Resource< TProfileData > {
    return this.json< TProfileData >( `v2/profile/${ uri }/profile.json` );
  }

  public history ( uri: string ) : Resource< TProfileHistory > {
    return this.csv< TProfileHistory >( `v2/profile/${ uri }/history.csv` );
  }

  public index () : CollectableResource< TProfileIndex, Collection< TProfileIndexItem > > {
    return this.json( 'v2/profile/index.json', data => collection(
      data.items.map( i => profileEntity( this, i ) ), ( item, query, terms ) => {
        const name = sanitize( item.name );

        return (
          name.includes( query ) || item.text.includes( query ) ||
          terms.every( t => name.includes( t ) || item.text.includes( t ) )
        );
      }
    ) );
  }

  public search () : CollectableResource< TSearchIndex, Collection< TSearchIndexItem > > {
    return this.json( 'v2/profile/search.json', data => collection(
      data.items.map( i => profileEntity( this, i ) ), ( item, query, terms ) =>
        item.searchName.includes( query ) || terms.every( t => item.searchName.includes( t ) )
    ) );
  }
}
