import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import type { CollectableResource } from '../core/resource/CollectableResource';
import { sanitize } from '../core/utils';
import type { Collection } from '../types';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  public _filter ( path: string ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this.json( path, data =>
      this.endpoints.profile._collect( data.items, ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      } )
    );
  }

  public deceased () : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/special/deceased.json` );
  }

  public dropOff () : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/special/dropOff.json` );
  }

  public family () : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/special/family.json` );
  }

  public selfMade () : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/special/selfMade.json` );
  }

  public industry ( industry: TIndustry ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  public age ( ageGroup: TAgeGroup ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/age/${ ageGroup }.json` );
  }

  public gender ( gender: TGender ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  public maritalStatus ( maritalStatus: TMaritalStatus ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }

  public citizenship ( isoCode: string ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  public country ( isoCode: string ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  public state ( uspsCode: string ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }
}
