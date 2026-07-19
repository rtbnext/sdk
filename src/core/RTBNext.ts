import { Filter } from '../api/Filter';
import { List } from '../api/List';
import { Mover } from '../api/Mover';
import { Profile } from '../api/Profile';
import { Stats } from '../api/Stats';
import { System } from '../api/System';
import type { API, RTBNextOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


export class RTBNext {
  private readonly httpClient: HttpClient;
  private readonly cacheManager: CacheManager;
  private readonly api: API;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout, cache } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );

    this.cacheManager = CacheManager.getInstance( this.httpClient, cache );
    this.api = this.loadAPIEndpoints();
  }

  private loadAPIEndpoints () : API {
    return {
      profile: new Profile( this.cacheManager ),
      list: new List( this.cacheManager ),
      mover: new Mover( this.cacheManager ),
      filter: new Filter( this.cacheManager ),
      stats: new Stats( this.cacheManager ),
      system: new System( this.cacheManager )
    };
  }

  public get client () : HttpClient { return this.httpClient }
  public get cache () : CacheManager { return this.cacheManager }

  public get profile () : Profile { return this.api.profile }
  public get list () : List { return this.api.list }
  public get mover () : Mover { return this.api.mover }
  public get filter () : Filter { return this.api.filter }
  public get stats () : Stats { return this.api.stats }
  public get system () : System { return this.api.system }
}
