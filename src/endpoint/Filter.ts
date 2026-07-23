import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import type { CollectableResource } from '../resource/CollectableResource';
import type { ProfileEntity } from '../types';
import { sanitize } from '../utils';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  public _filter ( path: string ) : CollectableResource< TFilter, TFilterItem, ProfileEntity< TFilterItem > > {
    return this.endpoints.profile._collect( path, ( item, query, terms ) => {
      const name = sanitize( item.name );
      return name.includes( query ) || terms.every( t => name.includes( t ) );
    } );
  }

  public get deceased () {
    return this._filter( `v2/filter/special/deceased.json` );
  }

  public get dropOff () {
    return this._filter( `v2/filter/special/dropOff.json` );
  }

  public get family () {
    return this._filter( `v2/filter/special/family.json` );
  }

  public get selfMade () {
    return this._filter( `v2/filter/special/selfMade.json` );
  }

  public industry ( industry: TIndustry ) {
    return this._filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  public age ( ageGroup: TAgeGroup ) {
    return this._filter( `v2/filter/age/${ ageGroup }.json` );
  }

  public gender ( gender: TGender ) {
    return this._filter( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  public maritalStatus ( maritalStatus: TMaritalStatus ) {
    return this._filter( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }

  public citizenship ( isoCode: string ) {
    return this._filter( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  public country ( isoCode: string ) {
    return this._filter( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  public state ( uspsCode: string ) {
    return this._filter( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }
}
