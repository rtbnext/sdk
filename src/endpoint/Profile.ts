import type { IProfile, ProfileCollection, ProfileData, ProfileEntity, ProfileHistory, ProfileMeta } from '../types/endpoint';
import type { CollectData, CollectItem, FindFn, SearchFn } from '../types/resource';
import { Endpoint } from './Endpoint';


/** Internal provider type used to expose profile helper methods. */
interface ProfileProvider {
  readonly use: {
    entity: Profile[ 'entity' ];
    collect: Profile[ 'collect' ];
    point: Profile[ 'point' ];
  };
}


/* Returns internal profile helper bindings from a profile endpoint instance. */
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
}
