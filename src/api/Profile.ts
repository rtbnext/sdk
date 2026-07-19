import type { TProfileIndex } from '@rtbnext/schema/src/model/profile';
import type { ApiResponse, RequestOptions } from '../types';
import { API } from './API';


export class Profile extends API {
  public async index ( options?: RequestOptions ) : Promise< ApiResponse< TProfileIndex > > {
    return this.json< TProfileIndex >( 'profile/index.json', options );
  }
}
