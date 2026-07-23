import { EmptyCache } from '../cache/EmptyCache';
import { MemoryCache } from '../cache/MemoryCache';
import type { Cache, CacheMode, CacheOptions, HttpResponse, RequestOptions, ResourceState } from '../types';
import type { HttpClient } from './HttpClient';


export class ResourceLoader {
  private constructor (
    private readonly cache: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  private createState ( res: HttpResponse, prev?: ResourceState ) : ResourceState {
    const created = Date.now();
    const maxAge = res.headers.get( 'Cache-Control' )?.match( /max-age=(\d+)/i )?.[ 1 ];
    const expires = maxAge ? created + Number( maxAge ) * 1000 : prev?.expires;

    const etag = res.headers.get( 'ETag' ) ?? prev?.etag;
    const lastModified = res.headers.get( 'Last-Modified' ) ?? prev?.lastModified;

    const response = res.status === 304 && prev ? { ...prev.response, headers: res.headers } : res;
    return { response, created, expires, etag, lastModified };
  }

  private async fetch ( path: string, prev?: ResourceState, options?: RequestOptions ) : Promise< ResourceState > {
    const headers = new Headers( options?.headers );
    if ( prev?.etag ) headers.set( 'If-None-Match', prev.etag );
    if ( prev?.lastModified ) headers.set( 'If-Modified-Since', prev.lastModified );

    const res = await this.httpClient.request( path, { ...options, headers } );
    return this.createState( res, prev );
  }

  private isExpired ( state: ResourceState ) : boolean {
    return !! state.expires && state.expires <= Date.now();
  }

  public async refresh ( path: string, options?: RequestOptions ) : Promise< ResourceState > {
    const cached = await this.cache.get( path );
    const state = await this.fetch( path, cached ?? undefined, options );
    await this.cache.set( path, state );

    return state;
  }

  public async load ( path: string, options?: RequestOptions ) : Promise< ResourceState > {
    if ( this.mode === 'revalidate' ) return this.refresh( path, options );

    const cached = await this.cache.get( path );
    if ( cached && ( this.mode === 'session' || ! this.isExpired( cached ) ) ) return cached;

    const state = await this.fetch( path, undefined, options );
    if ( this.mode === 'session' || state.expires ) await this.cache.set( path, state );

    return state;
  }

  public get size () : number {
    return this.cache.size;
  }

  public async delete ( path: string ) : Promise< void > {
    await this.cache.delete( path );
  }

  public async clear () : Promise< void > {
    await this.cache.clear();
  }

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : ResourceLoader {
    const { type = 'memory', mode = 'ttl' } = options;
    const cache = type === 'memory' ? new MemoryCache() : type === false ? new EmptyCache() : type;

    return new ResourceLoader( cache, client, mode );
  }
}
