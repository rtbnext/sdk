import type { TProfileIndex } from '@rtbnext/schema/src/model/profile';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  private readonly uris = new Map< string, string >();

  public index () : Resource< TProfileIndex > {
    return this.json< TProfileIndex >( 'profile/index.json' ).on( 'update', ( { data } ) => {
      this.uris.clear();

      data().then( ( { items } ) => {
        for ( const { uri, aliases } of items ) {
          for ( const alias of aliases ) this.uris.set( alias, uri );
          this.uris.set( uri, uri );
        }
      } );
    } );
  }
}
