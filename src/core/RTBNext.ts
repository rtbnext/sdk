import { Filter } from '../api/Filter';
import { List } from '../api/List';
import { Mover } from '../api/Mover';
import { Profile } from '../api/Profile';
import { Stats } from '../api/Stats';
import { System } from '../api/System';
import type { Endpoints, RTBNextOptions } from '../types';
import { CacheManager } from './CacheManager';
import { HttpClient } from './HttpClient';


export class RTBNext {
  private readonly httpClient: HttpClient;
  private readonly cacheManager: CacheManager;
  private readonly endpoints: Endpoints;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout, cache } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );

    this.cacheManager = CacheManager.getInstance( this.httpClient, cache );
    this.endpoints = this.loadEndpoints();
  }

  private loadEndpoints () : Endpoints {
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

  public get profile () : Profile { return this.endpoints.profile }
  public get list () : List { return this.endpoints.list }
  public get mover () : Mover { return this.endpoints.mover }
  public get filter () : Filter { return this.endpoints.filter }
  public get stats () : Stats { return this.endpoints.stats }
  public get system () : System { return this.endpoints.system }
}
