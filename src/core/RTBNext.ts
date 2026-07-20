import { Filter } from '../api/Filter';
import { List } from '../api/List';
import { Mover } from '../api/Mover';
import { Profile } from '../api/Profile';
import { Stats } from '../api/Stats';
import { System } from '../api/System';
import type { RTBNextOptions } from '../types';
import { CacheManager } from '../../_old/CacheManager';
import { HttpClient } from './HttpClient';


export class RTBNext {
  public readonly httpClient: HttpClient;
  public readonly cacheManager: CacheManager;

  public readonly profile: Profile;
  public readonly list: List;
  public readonly mover: Mover;
  public readonly filter: Filter;
  public readonly stats: Stats;
  public readonly system: System;

  constructor ( private readonly options: RTBNextOptions ) {
    const { client, baseUrl, httpTimeout, cache } = this.options;

    this.httpClient = new HttpClient( {
      baseUrl: baseUrl ?? 'https://api.rtbnext.de/v2',
      sdkVersion: '1.0.0', client,
      limiter: { maxRequests: 60, perMs: 10_000 },
      timeout: httpTimeout ?? 5_000
    } );

    this.cacheManager = CacheManager.getInstance( this.httpClient, cache );

    this.profile = new Profile( this.cacheManager );
    this.list = new List( this.cacheManager );
    this.mover = new Mover( this.cacheManager );
    this.filter = new Filter( this.cacheManager );
    this.stats = new Stats( this.cacheManager );
    this.system = new System( this.cacheManager );
  }
}
