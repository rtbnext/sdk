import type { TProfileData, TProfileHistory, TProfileMetaData } from '@rtbnext/schema/src/model/profile';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Profile extends Endpoint {
  public profileMeta ( uri: string ) : Resource< TProfileMetaData > {
    return this.json< TProfileMetaData >( `v2/profile/${ uri }/meta.json` );
  }

  public profileData ( uri: string ) : Resource< TProfileData > {
    return this.json< TProfileData >( `v2/profile/${ uri }/profile.json` );
  }

  public profileHistory ( uri: string ) : Resource< TProfileHistory > {
    return this.csv< TProfileHistory >( `v2/profile/${ uri }/history.csv` );
  }
}
