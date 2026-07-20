import type { TProfileData, TProfileHistory, TProfileIndex, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex } from '@rtbnext/schema/src/model/search';
import type { Resource } from '../core/Resource';
import { Utils } from '../core/Utils';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public index () : Resource< TProfileIndex > {
    return this.json< TProfileIndex >( 'profile/index.json' );
  }

  public searchIndex () : Resource< TSearchIndex > {
    return this.json< TSearchIndex >( 'profile/search.json' );
  }

  public profileMeta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json< TProfileMetaData >( `profile/${ uri }/meta.json` );
  }

  public profileData ( uri: string ) : Resource< TProfileData > {
    return this.json< TProfileData >( `profile/${ uri }/profile.json` );
  }

  public profileHistory ( uri: string ) : Resource< TProfileHistory > {
    return this.csv< TProfileHistory >( `profile/${ uri }/history.json` );
  }

  public async get ( uriLike: string ) : Promise< {
    meta: Resource< TProfileMetaData >,
    data: Resource< TProfileData >,
    history: Resource< TProfileHistory >
  } | null > {
    const index = await this.index().data(), test = Utils.sanitize( uriLike );
    const uri = index.items.find( i => i.uri === test || i.aliases.includes( test ) )?.uri;

    return ! uri ? null : {
      meta: this.profileMeta( uri ),
      data: this.profileData( uri ),
      history: this.profileHistory( uri )
    };
  }
}
