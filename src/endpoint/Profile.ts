import type { TProfileData, TProfileHistory, TProfileIndex, TProfileIndexItem, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Resource } from '../core/Resource';
import { Utils } from '../core/Utils';
import { Endpoint } from './Endpoint';


export type ProfileResources = {
  readonly meta: Resource< TProfileMetaData >;
  readonly data: Resource< TProfileData >;
  readonly history: Resource< TProfileHistory >;
};


export class Profile extends Endpoint {
  public profileMeta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json< TProfileMetaData >( `v2/profile/${ uri }/meta.json` );
  }

  public profileData ( uri: string ) : Resource< TProfileData > {
    return this.json< TProfileData >( `v2/profile/${ uri }/profile.json` );
  }

  public profileHistory ( uri: string ) : Resource< TProfileHistory > {
    return this.csv< TProfileHistory >( `v2/profile/${ uri }/history.csv` );
  }

  public async index () {
    const self = this;
    const items: Readonly< TProfileIndexItem & { get: ProfileResources } >[] = [];
    let idx = -1;

    const index = self.json< TProfileIndex >( 'v2/profile/index.json' );
    const raw = await index.data();

    for ( const item of raw.items ) {
      let meta: Resource< TProfileMetaData >;
      let data: Resource< TProfileData >;
      let history: Resource< TProfileHistory >;

      items.push( Object.freeze( { ...item, get: {
        get meta () { return meta ??= self.profileMeta( item.uri ) },
        get data () { return data ??= self.profileData( item.uri ) },
        get history () { return history ??= self.profileHistory( item.uri ) }
      } } ) );
    }

    return Object.freeze( { index, items, count: items.length,
      get first () { return items[ 0 ] ?? null },
      get last () { return items.at( -1 ) ?? null },
      get position () { return idx },
      get current () { return items[ idx ] ?? null },

      get hasNext () { return idx + 1 < items.length },
      get next () { return items[ ++idx ] ?? null },
      get hasPrev () { return idx > 0 },
      get prev () { return items[ --idx ] ?? null },

      at ( index: number ) { return items[ index ] ?? null },

      find ( uriLike: string ) {
        const uri = Utils.sanitize( uriLike );
        return items.find( i => i.uri === uri || i.aliases.includes( uri ) );
      },

      search ( query: string ) {
        const terms = Utils.sanitize( query, ' ' ).split( ' ' );
        return items.filter( i => terms.every( t => i.name.includes( t ) || i.text.includes( t ) ) );
      },

      filter ( predicate: ( item: TProfileIndexItem ) => boolean ) {
        return items.filter( predicate );
      }
    } );
  }
}
