import type { IProfile } from '../types/endpoint';
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
export class Profile extends Endpoint implements IProfile, ProfileProvider {}
