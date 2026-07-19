import type { CacheManager } from '../core/CacheManager';
import { API } from './API';


export class Profile extends API {
  constructor ( cache: CacheManager ) {
    super( cache, {
      index: {
        path: 'profile/index.json',
        format: 'json'
      }
    } );
  }
}
