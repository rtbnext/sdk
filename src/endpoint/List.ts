import type { TListItem, TListSnapshot } from '@rtbnext/schema/src/model/list';
import type { CollectableResource } from '../resource/CollectableResource';
import type { ProfileEntity } from '../types';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';


export class List extends Endpoint {
  public snapshot < T extends TListItem & { uri: string } > (
    uri: string, date: string
  ) : CollectableResource< TListSnapshot< T >, T, ProfileEntity< T > > {
    return this.endpoints.profile._collect(
      `v2/list/${ uri }/${ ymd( date ) }.json`, ( item, query, terms ) => {
        const name = sanitize( item.name );
        return name.includes( query ) || terms.every( t => name.includes( t ) );
      }
    );
  }
}
