import { HttpClient } from './core/HttpClient';
import { ResourceLoader } from './core/ResourceLoader';
import { Filter } from './endpoint/Filter';
import { List } from './endpoint/List';
import { Mover } from './endpoint/Mover';
import { Profile } from './endpoint/Profile';
import { Stats } from './endpoint/Stats';
import { System } from './endpoint/System';
import type { RTBNextOptions } from './types/core';
import type { Endpoints } from './types/endpoint';


const DEFAULT_OPTIONS = {
  sdkVersion: '1.0.0',
  baseUrl: 'https://api.rtbnext.de',
  httpTimeout: 5_000,
  limiter: { maxRequests: 60, perMs: 10_000 },
  cache: { type: 'memory', mode: 'ttl' }
} as const;


export class RTBNext {
  public readonly httpClient: HttpClient;
  public readonly resourceLoader: ResourceLoader;
  public readonly endpoints: Endpoints;

  public readonly profile: Profile;
  public readonly list: List;
  public readonly mover: Mover;
  public readonly filter: Filter;
  public readonly stats: Stats;
  public readonly system: System;

  constructor ( options: RTBNextOptions ) {
    this.httpClient = new HttpClient( {
      baseUrl: options.baseUrl ?? DEFAULT_OPTIONS.baseUrl,
      sdkVersion: DEFAULT_OPTIONS.sdkVersion,
      client: options.client,
      limiter: DEFAULT_OPTIONS.limiter,
      timeout: options.httpTimeout ?? DEFAULT_OPTIONS.httpTimeout
    } );

    this.resourceLoader = ResourceLoader.getInstance( this.httpClient, {
      ...DEFAULT_OPTIONS.cache, ...options.cache
    } );

    const endpoints = {} as Endpoints;

    this.profile = new Profile( this.resourceLoader, endpoints );
    this.list = new List( this.resourceLoader, endpoints );
    this.mover = new Mover( this.resourceLoader, endpoints );
    this.filter = new Filter( this.resourceLoader, endpoints );
    this.stats = new Stats( this.resourceLoader, endpoints );
    this.system = new System( this.resourceLoader, endpoints );

    endpoints.profile = this.profile;
    endpoints.list = this.list;
    endpoints.mover = this.mover;
    endpoints.filter = this.filter;
    endpoints.stats = this.stats;
    endpoints.system = this.system;

    this.endpoints = Object.freeze( endpoints );
  }
}
