import type { IProfile } from '../types/endpoint';


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
