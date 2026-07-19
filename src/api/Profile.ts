import type { TProfileIndex } from '@rtbnext/schema/src/model/profile';
import type { ApiResponse, RequestOptions } from '../types';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public async index ( options?: RequestOptions ) : Promise< ApiResponse< TProfileIndex > > {
    return this.json< TProfileIndex >( 'profile/index.json', options );
  }
}
