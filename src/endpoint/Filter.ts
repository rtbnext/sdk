import type { TAgeGroup, TGender, TIndustry, TMaritalStatus } from '@rtbnext/schema/src/base/const';

import type { FilterCollection, FilterEndpoint, FilterIndex } from '../types/endpoint';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';


/**
 * Endpoint implementation for filter resources.
 * 
 * Provides access to filter collections for special categories, demographics, and indices.
 */
export class Filter extends Endpoint implements FilterEndpoint {
  /**
   * Creates a filter collection using the profile endpoint's collection helper.
   * 
   * @param path - The filter resource path.
   * @returns The filter collection.
   */
  protected filter ( path: string ) : FilterCollection {
    return useProfile( this.endpoints.profile ).collect( path );
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

  /**
   * Industry filter collection.
   * 
   * @param industry - The industry identifier.
   * @returns The filter collection for the specified industry.
   */
  public industry ( industry: TIndustry ) : FilterCollection {
    return this.filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }

  /**
   * Age group filter collection.
   * 
   * @param ageGroup - The age group identifier (e.g., `18-24`, `25-34`).
   * @returns The filter collection for the specified age group.
   */
  public age ( ageGroup: TAgeGroup ) : FilterCollection {
    return this.filter( `v2/filter/age/${ ageGroup }.json` );
  }

  /**
   * Gender filter collection.
   * 
   * @param gender - The gender identifier (e.g., `male`, `female`).
   * @returns The filter collection for the specified gender.
   */
  public gender ( gender: TGender ) : FilterCollection {
    return this.filter( `v2/filter/gender/${ gender.toLowerCase() }.json` );
  }

  /**
   * Marital status filter collection.
   * 
   * @param maritalStatus - The marital status identifier (e.g., `single`, `married`).
   * @returns The filter collection for the specified marital status.
   */
  public maritalStatus ( maritalStatus: TMaritalStatus ) : FilterCollection {
    return this.filter( `v2/filter/maritalStatus/${ maritalStatus.toLowerCase() }.json` );
  }

  /**
   * Citizenship filter collection.
   * 
   * @param isoCode - The ISO country code (e.g., `US`, `CA`).
   * @returns The filter collection for the specified citizenship.
   */
  public citizenship ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/citizenship/${ isoCode.toUpperCase() }.json` );
  }

  /**
   * Country filter collection.
   * 
   * @param isoCode - The ISO country code (e.g., `US`, `CA`).
   * @returns The filter collection for the specified country.
   */
  public country ( isoCode: string ) : FilterCollection {
    return this.filter( `v2/filter/country/${ isoCode.toUpperCase() }.json` );
  }

  /**
   * State filter collection.
   * 
   * @param uspsCode - The USPS state code (e.g., `CA`, `NY`).
   * @returns The filter collection for the specified state.
   */
  public state ( uspsCode: string ) : FilterCollection {
    return this.filter( `v2/filter/state/${ uspsCode.toUpperCase() }.json` );
  }

  /** Provides the root filter index resource. */
  public get index () : FilterIndex {
    return this.indexable( 'v2/filter/index.json',
      path => this.filter( `v2/filter/${ path.join( '/' ) }.json` )
    );
  }
}
