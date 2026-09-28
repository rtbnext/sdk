import type { ProfileEndpoint } from '../types/endpoint';


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
export const useProfileProvider = ( profile: ProfileEndpoint ) : ProfileProvider[ 'use' ] =>
  ( profile as ProfileEndpoint & ProfileProvider ).use;
