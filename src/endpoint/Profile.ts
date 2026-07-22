import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { Resource } from '../core/Resource';
import { listCollection } from '../core/utils';
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

  public async index () : Promise< any > {
    return listCollection< TProfileIndexItem >( this.endpoints, ( await this.profileIndex().data() ).items );
  }

  public async search () : Promise< any > {
    return listCollection< TSearchIndexItem >( this.endpoints, ( await this.searchIndex().data() ).items );
  }
}
