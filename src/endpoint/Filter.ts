import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';
import type { FilterCollection, FilterIndex, IFilter } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { profileProvider } from './Profile';


/**
 * Endpoint implementation for filter resources.
 * 
 * Provides access to filter collections for special categories, demographics, and indices.
 */
export class Filter extends Endpoint implements IFilter {
  /**
   * Creates a filter collection using the profile endpoint's collection helper.
   * 
   * @param path - The filter resource path.
   * @returns The filter collection.
   */
  protected filter ( path: string ) : FilterCollection {
    return profileProvider( this.endpoints.profile ).collect( path );
  }

  /** Deceased profiles filter collection. */
  public get deceased () : FilterCollection {
    return this.filter( 'v2/filter/special/deceased.json' );
  }

  /** Drop-off profiles filter collection. */
  public get dropOff () : FilterCollection {
    return this.filter( 'v2/filter/special/dropOff.json' );
  }

  /** Family profiles filter collection. */
  public get family () : FilterCollection {
    return this.filter( 'v2/filter/special/family.json' );
  }

  /** Self-made profiles filter collection. */
  public get selfMade () : FilterCollection {
    return this.filter( 'v2/filter/special/selfMade.json' );
  }

  /** Industry filter collection. */
  public industry ( industry: TIndustry ) : FilterCollection {
    return this.filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  /** Age group filter collection. */
  public age ( ageGroup: TAgeGroup ) : FilterCollection {
    return this.filter( `v2/filter/age/${ ageGroup }.json` );
  }

  /** Gender filter collection. */
  public gender ( gender: TGender ) : FilterCollection {
    return this.filter( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  /** Marital status filter collection. */
  public maritalStatus ( maritalStatus: TMaritalStatus ) : FilterCollection {
    return this.filter( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }

  /** Citizenship filter collection. */
  public citizenship ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  /** Country filter collection. */
  public country ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  /** State filter collection. */
  public state ( uspsCode: string ) : FilterCollection {
    return this.filter( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }

  /** Provides the root filter index resource. */
  public get index () : FilterIndex {
    return this.json( 'v2/filter/index.json', {
      index: path => this.filter( `v2/filter/${ path.join( '/' ) }.json` )
    } );
  }
}
