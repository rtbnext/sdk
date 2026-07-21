import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex, TSearchIndexItem } from '@rtbnext/schema/src/model/search';
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
  total: number;
  count: number;

  first: ProfileItem< T > | null;
  last: ProfileItem< T > | null;
  position: number;
  current: ProfileItem< T > | null;

  hasNext: boolean;
  next: ProfileItem< T > | null;
  hasPrev: boolean;
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

function profileList < T > ( profile: Profile, raw: readonly ( T & { uri: string } )[], total = raw.length ) : ProfileList< T > {
  const items = raw.map( i => profileItem( profile, i ) );
  let idx = -1;

  return Object.freeze( { items, total, count: items.length,
    get first () { return items[ 0 ] ?? null },
    get last () { return items.at( -1 ) ?? null },
    get position () { return idx },
    get current () { return items[ idx ] ?? null },

    get hasNext () { return idx + 1 < items.length },
    get next () { return items[ ++idx ] ?? null },
    get hasPrev () { return idx > 0 },
    get prev () { return items[ --idx ] ?? null },

    at ( index: number ) { return items[ index ] ?? null },
    page ( page: number, perPage: number = 10 ) {
      const start = ( page - 1 ) * perPage, end = start + perPage;
      return profileList( profile, raw.slice( start, end ), total );
    }
  } );
}


export class Profile extends Endpoint {
  public index () : Resource< TProfileIndex > {
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

  public async all () : Promise< ProfileList< TProfileIndexItem > > {
    return profileList( this, ( await this.index().data() ).items );
  }

  private async resolveItem ( uriLike: string ) : Promise< TProfileIndexItem | null > {
    const index = await this.index().data(), uri = Utils.sanitize( uriLike );
    return index.items.find( i => i.uri === uri || i.aliases.includes( uri ) ) ?? null;
  }

  public async resolve ( uriLike: string ) : Promise< string | null > {
    return ( await this.resolveItem( uriLike ) )?.uri ?? null;
  }

  public async find ( uriLike: string ) : Promise< ProfileItem< TProfileIndexItem > | null > {
    const item = await this.resolveItem( uriLike );
    return item ? profileItem( this, item ) : null;
  }

  public async search ( query: string ) : Promise< ProfileList< TProfileIndexItem > > {
    const index = await this.index().data(), terms = Utils.sanitize( query, ' ' ).split( ' ' );
    const items = index.items.filter( i => terms.every( t => i.name.includes( t ) || i.text.includes( t ) ) );

    return profileList( this, items );
  }

  public async filter ( predicate: ( item: TSearchIndexItem ) => boolean ) : Promise< ProfileList< TSearchIndexItem > > {
    return profileList( this, ( await this.searchIndex().data() ).items.filter( predicate ) );
  }
}
