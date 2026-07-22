import type { TFilterIndex } from '@rtbnext/schema/src/model/filter';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  public filterIndex () : Resource< TFilterIndex > {
    return this.json< TFilterIndex >( 'v2/filter/index.json' );
  }
}
