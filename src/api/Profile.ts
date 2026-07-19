import type { TProfileIndex } from '@rtbnext/schema/src/model/profile';
import type { TSearchIndex } from '@rtbnext/schema/src/model/search';
import type { ApiResponse, RequestOptions } from '../types';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  private profileIndex?: ApiResponse< TProfileIndex >;
  private profileSearchIndex?: ApiResponse< TSearchIndex >;

  public async index ( options?: RequestOptions ) : Promise< ApiResponse< TProfileIndex > > {
    return this.profileIndex ??= await this.json< TProfileIndex >( 'profile/index.json', options );
  }

  public async searchIndex ( options?: RequestOptions ) : Promise< ApiResponse< TSearchIndex > > {
    return this.profileSearchIndex ??= await this.json< TSearchIndex >( 'profile/search.json', options );
  }
}
