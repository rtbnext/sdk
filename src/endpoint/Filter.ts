import type { FilterCollection, IFilter } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


export class Filter extends Endpoint implements IFilter {
  protected filter ( path: string ) : FilterCollection {
    return profileProvider( this.endpoints.profile ).collect( path );
  }
}
