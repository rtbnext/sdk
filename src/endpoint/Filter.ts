import type { FilterCollection, FilterIndex, IFilter } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


export class Filter extends Endpoint implements IFilter {
  protected filter ( path: string ) : FilterCollection {
    return profileProvider( this.endpoints.profile ).collect( path );
  }

  public get index () : FilterIndex {
    return this.json( 'v2/filter/index.json', {
      index: path => this.filter( `v2/filter/${ path.join( '/' ) }.json` )
    } );
  }
}
