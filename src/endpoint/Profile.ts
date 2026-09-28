import type { TProfileHistoryItem } from '@rtbnext/schema/src/model/profile';

import type { CollectData, CollectItem, FindFn, SearchFn } from '../types/collection';
import type {
  ProfileCollection, ProfileData, ProfileEndpoint, ProfileEntity,
  ProfileHistory, ProfileHistoryPoint, ProfileMeta
} from '../types/endpoint';
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
export const useProfile = ( profile: ProfileEndpoint ) : ProfileProvider[ 'use' ] =>
  ( profile as ProfileEndpoint & ProfileProvider ).use;


/**
 * Endpoint implementation for profile resources.
 * 
 * Provides access to profile metadata, details, history, index, and search index.
 */
export class Profile extends Endpoint implements ProfileEndpoint, ProfileProvider {
  /**
   * Creates a profile entity with lazy-loaded related resources.
   * 
   * @template I - The type of the raw profile item, which must include a `uri` property.
   * @param item - The raw profile item.
   * @returns A profile entity with lazy-loaded `meta`, `data`, and `history` properties.
   */
  protected entity < I extends CollectItem > ( item: I ) : ProfileEntity< I > {
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
  protected collect < D extends CollectData< I >, I extends CollectItem > (
    path: string, find?: FindFn< I >, search?: SearchFn< I >
  ) : ProfileCollection< D, I > {
    return this.collectable( path, item => this.entity( item ), find, search );
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
    };
  }

  /** Returns profile metadata for the given URI. */
  public meta ( uri: string ) : ProfileMeta {
    return this.resource( `v2/profile/${ uri }/meta.json` );
  }

  /** Returns profile data for the given URI. */
  public data ( uri: string ) : ProfileData {
    return this.resource( `v2/profile/${ uri }/profile.json` );
  }

  /** Returns profile history time-series data for the given URI. */
  public history ( uri: string ) : ProfileHistory {
    return this.series( `v2/profile/${ uri }/history.csv`, row => this.point( row ) );
  }

  /** Returns the profile entity for a URI. */
  public get ( uri: string ) : ProfileEntity< CollectItem > {
    return this.entity( { uri } );
  }
}
