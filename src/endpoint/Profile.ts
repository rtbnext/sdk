import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { Resource } from '../core/Resource';
import { listCollection, profileItem, sanitize } from '../core/utils';
import { ListCollection } from '../types';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public profileIndex () : Resource< TProfileIndex > {
    return this.json< TProfileIndex >( 'v2/profile/index.json' );
  }

  public searchIndex () : Resource< TSearchIndex > {
    return this.json< TSearchIndex >( 'v2/profile/search.json' );
  }

  public profileMeta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json< TProfileMetaData >( `v2/profile/${ uri }/meta.json` );
  }

  public profileData ( uri: string ) : Resource< TProfileData > {
    return this.json< TProfileData >( `v2/profile/${ uri }/profile.json` );
  }

  public profileHistory ( uri: string ) : Resource< TProfileHistory > {
    return this.csv< TProfileHistory >( `v2/profile/${ uri }/history.csv` );
  }

  public async index () : Promise< ListCollection< TProfileIndexItem > > {
    const items = ( await this.profileIndex().data() ).items.map( i => profileItem( this, i ) );

    return listCollection< TProfileIndexItem >( items, ( item, query, terms ) =>
      sanitize( item.name ).includes( query ) || item.text.includes( query ) ||
      terms.every( t => item.name.includes( t ) || item.text.includes( t ) )
    );
  }

  public async search () : Promise< ListCollection< TSearchIndexItem > > {
    const items = ( await this.searchIndex().data() ).items.map( i => profileItem( this, i ) );

    return listCollection< TSearchIndexItem >( items, ( item, query, terms ) =>
      item.searchName.includes( query ) || terms.every( t => item.searchName.includes( t ) )
    );
  }
}
