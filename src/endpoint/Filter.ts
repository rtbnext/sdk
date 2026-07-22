import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterIndex } from '@rtbnext/schema/src/model/filter';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  public filterIndex () : Resource< TFilterIndex > {
    return this.json< TFilterIndex >( 'v2/filter/index.json' );
  }

  public industry ( industry: TIndustry ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }
}
