import type { DBStats, GlobalStats, ProfileStats, WealthStats } from '../types/endpoint';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public get db () : DBStats {
    return this.json( 'v2/stats/db.json' );
  }

  public get global () : GlobalStats {
    return this.json( 'v2/stats/global.json' );
  }

  public get profile () : ProfileStats {
    return this.json( 'v2/stats/profile.json' );
  }

  public get wealth () : WealthStats {
    return this.json( 'v2/stats/wealth.json' );
  }
}
