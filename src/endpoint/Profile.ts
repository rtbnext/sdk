import type { TProfileHistoryItem } from '@rtbnext/schema/src/model/profile';
import type {
  IProfile, ProfileCollection, ProfileData, ProfileEntity,
  ProfileHistory, ProfileIndex, ProfileMeta, SearchIndex
} from '../types/endpoint';
import type { FindFn, SearchFn } from '../types/resource';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint implements IProfile {
  private entity < I extends { uri: string } > ( item: I ) : ProfileEntity< I > {
    let meta: ProfileMeta, data: ProfileData, history: ProfileHistory;
    const self = this;
  
    return Object.freeze( { ...item,
      get meta () { return meta ??= self.meta( item.uri ) },
      get data () { return data ??= self.data( item.uri ) },
      get history () { return history ??= self.history( item.uri ) }
    } );
  }

  private collect < D extends { items: I[] }, I extends { uri: string } > (
    path: string, find?: FindFn< I >, search?: SearchFn< I >
  ) : ProfileCollection< D, I > {
    return this.json( path, { entity: item => this.entity( item ), find, search } );
  }

  public get use () {
    return { entity: this.entity.bind( this ), collect: this.collect.bind( this ) }
  }

  public meta ( uri: string ) : ProfileMeta {
    return this.json( `v2/profile/${ uri }/meta.json` );
  }

  public data ( uri: string ) : ProfileData {
    return this.json( `v2/profile/${ uri }/profile.json` );
  }

  public history ( uri: string ) : ProfileHistory {
    return this.csv( `v2/profile/${ uri }/history.csv`, {
      point: ( [ date, rank, networth, change, changePct ]: TProfileHistoryItem ) => ( {
        date, rank, networth, change, changePct
      } )
    } );
  }

  public get ( uri: string ) : ProfileEntity< { uri: string } > {
    return this.entity( { uri } );
  }

  public get index () : ProfileIndex {
    return this.collect( 'v2/profile/index.json' );
  }

  public get searchIndex () : SearchIndex {
    return this.collect( 'v2/profile/search.json' );
  }
}
