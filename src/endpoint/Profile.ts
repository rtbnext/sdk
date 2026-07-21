import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex } from '@rtbnext/schema/src/model/search';
import type { Resource } from '../core/Resource';
import { Utils } from '../core/Utils';
import { Endpoint } from './Endpoint';


type ProfileItem< T > = Readonly< T & {
  meta: Resource< TProfileMetaData >,
  data: Resource< TProfileData >,
  history: Resource< TProfileHistory >
} >;

type ProfileList< T > = Readonly< {
  items: readonly ProfileItem< T >[];
  count: number;

  first: ProfileItem< T > | null;
  last: ProfileItem< T > | null;
  current: ProfileItem< T > | null;
  next: ProfileItem< T > | null;
  prev: ProfileItem< T > | null;

  at ( index: number ) : ProfileItem< T > | null;
  page ( page: number, perPage?: number ) : ProfileList< T >;
} >;


function profileItem < T > ( profile: Profile, item: T & { uri: string } ) : ProfileItem< T > {
  let meta: Resource< TProfileMetaData >;
  let data: Resource< TProfileData >;
  let history: Resource< TProfileHistory >;

  return Object.freeze( { ...item,
    get meta () { return meta ??= profile.profileMeta( item.uri ) },
    get data () { return data ??= profile.profileData( item.uri ) },
    get history () { return history ??= profile.profileHistory( item.uri ) }
  } );
}

function profileList < T > ( profile: Profile, raw: ( T & { uri: string } )[], count: number ) : ProfileList< T > {
  const items = raw.map( i => profileItem( profile, i ) );
  let idx = 0;

  return Object.freeze( { items, count,
    get first () { return items[ 0 ] ?? null },
    get last () { return items.at( -1 ) ?? null },
    get current () { return items[ idx ] ?? null },
    get next () { return items[ ++idx ] ?? null },
    get prev () { return items[ --idx ] ?? null },

    at ( index: number ) { return items[ index ] ?? null },
    page ( page: number, perPage: number = 10 ) {
      const start = ( page - 1 ) * perPage, end = start + perPage;
      return profileList( profile, raw.slice( start, end ), count );
    }
  } );
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

    return item ? profileItem( this, item ) : null;
  }
}
