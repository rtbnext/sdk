import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import type { CollectableResource } from '../core/Resource';
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

  public industry ( industry: TIndustry ) : CollectableResource< TFilter, Collection< TFilterItem > > {
    return this._filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }
}
