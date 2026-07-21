import type { TIndustry } from '@rtbnext/schema/src/base/const';
import type { TDBStats, TGlobalStats, THistory, TProfileStats, TScatter, TStatsGroup, TWealthStats } from '@rtbnext/schema/src/model/stats';
import type { Resource } from '../core/Resource';
import { Endpoint } from './Endpoint';


export class Stats extends Endpoint {
  public db () : Resource< TDBStats > {
    return this.json< TDBStats >( 'v2/stats/db.json' );
  }

  public global () : Resource< TGlobalStats > {
    return this.json< TGlobalStats >( 'v2/stats/global.json' );
  }

  public profile () : Resource< TProfileStats > {
    return this.json< TProfileStats >( 'v2/stats/profile.json' );
  }

  public scatter () : Resource< TScatter > {
    return this.json< TScatter >( 'v2/stats/scatter.json' );
  }

  public wealth () : Resource< TWealthStats > {
    return this.json< TWealthStats >( 'v2/stats/wealth.json' );
  }

  public history () : Resource< THistory > {
    return this.csv< THistory >( 'v2/stats/history.csv' );
  }

  public industryIndex () : Resource< TStatsGroup< TIndustry >[ 'index' ] > {
    return this.json< TStatsGroup< TIndustry >[ 'index' ] >( 'v2/stats/industry/index.json' );
  }

  public industry ( industry: TIndustry ) : Resource< THistory > {
    return this.csv< THistory >( `v2/stats/industry/${ industry.toLowerCase() }.csv` );
  }

  public citizenshipIndex () : Resource< TStatsGroup< string >[ 'index' ] > {
    return this.json< TStatsGroup< string >[ 'index' ] >( 'v2/stats/citizenship/index.json' );
  }

  public citizenship ( isoCode: string ) : Resource< THistory > {
    return this.csv< THistory >( `v2/stats/citizenship/${ isoCode.toUpperCase() }.csv` );
  }

  public async group ( type: 'industry' ) : Promise< Record< TIndustry, Resource< THistory > > >;
  public async group ( type: 'citizenship' ) : Promise< Record< string, Resource< THistory > > >;

  public async group ( type: 'industry' | 'citizenship' ) : Promise< Record< string, Resource< THistory > > > {
    const index = await ( type === 'industry' ? this.industryIndex() : this.citizenshipIndex() ).data();
    return Object.fromEntries( Object.keys( index.items ).map( key => [ key, this[ type ]( key as any ) ] ) );
  }
}
