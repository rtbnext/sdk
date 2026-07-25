import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { FilterCollection, FilterIndex, IFilter } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


export class Filter extends Endpoint implements IFilter {
  protected filter ( path: string ) : FilterCollection {
    return profileProvider( this.endpoints.profile ).collect( path );
  }

  public get deceased () : FilterCollection {
    return this.filter( `v2/filter/special/deceased.json` );
  }

  public get dropOff () : FilterCollection {
    return this.filter( `v2/filter/special/dropOff.json` );
  }

  public get family () : FilterCollection {
    return this.filter( `v2/filter/special/family.json` );
  }

  public get selfMade () : FilterCollection {
    return this.filter( `v2/filter/special/selfMade.json` );
  }

  public industry ( industry: TIndustry ) : FilterCollection {
    return this.filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  public age ( ageGroup: TAgeGroup ) : FilterCollection {
    return this.filter( `v2/filter/age/${ ageGroup }.json` );
  }

  public gender ( gender: TGender ) : FilterCollection {
    return this.filter( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  public maritalStatus ( maritalStatus: TMaritalStatus ) : FilterCollection {
    return this.filter( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }

  public citizenship ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  public country ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  public state ( uspsCode: string ) : FilterCollection {
    return this.filter( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }

  public get index () : FilterIndex {
    return this.json( 'v2/filter/index.json', {
      index: path => this.filter( `v2/filter/${ path.join( '/' ) }.json` )
    } );
  }
}
