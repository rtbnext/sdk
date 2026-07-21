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

  public citizenship ( isoCode: string ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  public country ( isoCode: string ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  public state ( uspsCode: string ) : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }

  public deceased () : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/special/deceased.json` );
  }

  public dropOff () : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/special/dropOff.json` );
  }

  public family () : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/special/family.json` );
  }

  public selfMade () : Resource< TFilter > {
    return this.json< TFilter >( `v2/filter/special/selfMade.json` );
  }
}
