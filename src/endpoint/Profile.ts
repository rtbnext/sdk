import type { TProfileHistoryItem } from '@rtbnext/schema/src/model/profile';
import type {
  IProfile, ProfileCollection, ProfileData, ProfileEntity,
  ProfileHistory, ProfileHistoryPoint, ProfileIndex, ProfileMeta, SearchIndex
} from '../types/endpoint';
import type { FindFn, SearchFn } from '../types/resource';
import { Endpoint } from './Endpoint';


/** Internal provider type used to expose profile helper methods. */
interface ProfileProvider {
  readonly use: {
    entity: Profile[ 'entity' ];
    collect: Profile[ 'collect' ];
    point: Profile[ 'point' ];
  };
}


/**
 * Returns internal profile helper bindings from a profile endpoint instance.
 * 
 * @param profile - The profile endpoint implementation.
 */
export const profileProvider = ( profile: IProfile ) : ProfileProvider[ 'use' ] =>
  ( profile as IProfile & ProfileProvider ).use;


/**
 * Endpoint implementation for profile resources.
 * 
 * Provides access to profile metadata, details, history, index, and search index.
 */
export class Profile extends Endpoint implements IProfile, ProfileProvider {
  /**
   * Creates a profile entity with lazy-loaded related resources.
   * 
   * @template I - The type of the raw profile item, which must include a `uri` property.
   * @param item - The raw profile item.
   * @returns A profile entity with lazy-loaded `meta`, `data`, and `history` properties.
   */
  protected entity < I extends { uri: string } > ( item: I ) : ProfileEntity< I > {
    let meta: ProfileMeta, data: ProfileData, history: ProfileHistory;
    const self = this;
  
    return Object.freeze( { ...item,
      get meta () { return meta ??= self.meta( item.uri ) },
      get data () { return data ??= self.data( item.uri ) },
      get history () { return history ??= self.history( item.uri ) }
    } );
  }

  /**
   * Returns a profile collection resource from a JSON endpoint.
   * 
   * @template D - The raw data type of the collection, which must include an `items` array.
   * @template I - The type of individual items in the collection, which must include a `uri` string.
   * @param path - The collection path.
   * @param find - Optional custom find function.
   * @param search - Optional custom search function.
   * @returns A profile collection resource with lazy-loaded entities.
   */
  protected collect < D extends { items: I[] }, I extends { uri: string } > (
    path: string, find?: FindFn< I >, search?: SearchFn< I >
  ) : ProfileCollection< D, I > {
    return this.json( path, { entity: item => this.entity( item ), find, search } );
  }

  /**
   * Converts a raw profile history row into a typed history point.
   * 
   * @param row - The raw history row.
   * @returns The converted, typed history point.
   */
  protected point ( [ date, rank, networth, change, changePct ]: TProfileHistoryItem ) : ProfileHistoryPoint {
    return { date, rank, networth, change, changePct };
  }

  /** Exposes internal profile helper bindings for use by related endpoints. */
  public get use () {
    return {
      entity: this.entity.bind( this ),
      collect: this.collect.bind( this ),
      point: this.point.bind( this )
    }
  }

  /** Returns profile metadata for the given URI. */
  public meta ( uri: string ) : ProfileMeta {
    return this.json( `v2/profile/${ uri }/meta.json` );
  }

  /** Returns profile data for the given URI. */
  public data ( uri: string ) : ProfileData {
    return this.json( `v2/profile/${ uri }/profile.json` );
  }

  /** Returns profile history time-series data for the given URI. */
  public history ( uri: string ) : ProfileHistory {
    return this.csv( `v2/profile/${ uri }/history.csv`, { point: row => this.point( row ) } );
  }

  /** Returns the profile entity for a URI. */
  public get ( uri: string ) : ProfileEntity< { uri: string } > {
    return this.entity( { uri } );
  }

  /** Returns the profile index collection. */
  public get index () : ProfileIndex {
    return this.collect( 'v2/profile/index.json' );
  }

  /** Returns the profile search index collection. */
  public get searchIndex () : SearchIndex {
    return this.collect( 'v2/profile/search.json' );
  }
}
