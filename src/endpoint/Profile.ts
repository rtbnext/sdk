import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
import type { Resource } from '../core/Resource';
import { Utils } from '../core/Utils';
import { Endpoint } from './Endpoint';
import { Expand } from '../types';


type ProfileItem< T > = Expand< T & { uri: string } & {
  meta: Resource< TProfileMetaData >,
  data: Resource< TProfileData >,
  history: Resource< TProfileHistory >
} >;


function profileItem < T > ( item: T & { uri: string }, profile: Profile ) : ProfileItem< T > {
  const meta = profile.profileMeta( item.uri );
  const data = profile.profileData( item.uri );
  const history = profile.profileHistory( item.uri );

  return { ...item, meta, data, history } as ProfileItem< T >;
}


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

  public async find ( uriLike: string ) : Promise< ProfileItem< TProfileIndexItem > | null > {
    const index = await this.index().data(), test = Utils.sanitize( uriLike );
    const item = index.items.find( i => i.uri === test || i.aliases.includes( test ) );

    return item ? profileItem( item, this ) : null;
  }
}
