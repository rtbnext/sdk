import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterIndex } from '@rtbnext/schema/src/model/filter';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  public index () : Resource< TFilterIndex > {
    return this.json< TFilterIndex >( 'v2/filter/index.json' );
  }

  public industry ( industry: TIndustry ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  public age ( ageGroup: TAgeGroup ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/age/${ ageGroup }.json` );
  }

  public gender ( gender: TGender ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  public maritalStatus ( maritalStatus: TMaritalStatus ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }
}
