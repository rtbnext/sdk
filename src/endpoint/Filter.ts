import type { TAgeGroup, TFilterSpecial, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterIndex } from '@rtbnext/schema/src/model/filter';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


type Filters = {
  industry: { [ K in TIndustry ]?: Resource< TFilter > };
  citizenship: Record< string, Resource< TFilter > >;
  country: Record< string, Resource< TFilter > >;
  state: Record< string, Resource< TFilter > >;
  gender: { [ K in TGender ]?: Resource< TFilter > };
  age: { [ K in TAgeGroup ]?: Resource< TFilter > };
  maritalStatus: { [ K in TMaritalStatus ]?: Resource< TFilter > };
  special: Record< TFilterSpecial, Resource< TFilter > >;
};


function filters ( filter: Filter, index: TFilterIndex ) : Filters {
  const res = {} as Filters;

  for ( const [ group, items ] of Object.entries( index ) ) {
    if ( group === '$metadata' || ! Array.isArray( items ) ) continue;
    const target = ( res as any )[ group ] ??= {};

    for ( const key of items ) {
      let resource: Resource< TFilter >;

      Object.defineProperty( target, key, { enumerable: true, configurable: false, get () {
        return resource ??= group === 'special' ? ( filter as any )[ key ]() : ( filter as any )[ group ]( key );
      } } );
    }
  }

  return Object.freeze( res );
}


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

  public async all () : Promise< Filters > {
    return filters( this, await this.index().data() );
  }
}
