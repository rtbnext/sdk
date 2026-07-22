import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import { collection, profileEntity, sanitize } from '../core/utils';
import type { Collection } from '../types';
import { Endpoint } from './Endpoint';
import { TIndustry } from '@rtbnext/schema/src/base/const';


export class Filter extends Endpoint {
  private async filter ( path: string ) : Promise< Collection< TFilterItem > > {
    return collection(
      ( await this.json< TFilter >( path ).data() ).items.map(
        i => profileEntity( this.endpoints.profile, i )
      ),
      ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      }
    );
  }

  public async industry ( industry: TIndustry ) : Promise< Collection< TFilterItem > > {
    return this.filter( `v2/filter/industry/${ industry.toLowerCase() }.json` );
  }
}
