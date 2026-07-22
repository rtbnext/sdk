import type { TFilter, TFilterItem } from '@rtbnext/schema/src/model/filter';
import { collection, profileItem, sanitize } from '../core/utils';
import type { Collection } from '../types';
import { Endpoint } from './Endpoint';


export class Filter extends Endpoint {
  private async filter ( path: string ) : Promise< Collection< TFilterItem > > {
    return collection(
      ( await this.json< TFilter >( path ).data() ).items.map(
        i => profileItem( this.endpoints.profile, i )
      ),
      ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      }
    );
  }
}
