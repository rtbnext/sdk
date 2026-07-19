import type { Cache, CacheEntry, CacheMode, CacheOptions, HttpResponse, RequestOptions } from '../types';
import { HttpClient } from './HttpClient';
import { MemoryCache } from './MemoryCache';


export class CacheManager {
  private constructor (
    private readonly store: Cache | false,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  private isExpired ( entry: CacheEntry ) : boolean {
    return entry.expires !== undefined && entry.expires <= Date.now();
  }

  private refreshEntry ( res: HttpResponse, cached?: CacheEntry ) : CacheEntry {
    const created = Date.now();
    const cacheControl = res.headers.get( 'Cache-Control' ) ?? undefined;
    const match = cacheControl?.match( /max-age=(\d+)/i );
    const expires = match ? created + Number( match[ 1 ] ) * 1000 : cached?.expires;

    return {
      response: cached ? { ...cached.response, headers: res.headers } : res,
      created, expires, etag: res.headers.get( 'ETag' ) ?? cached?.etag,
      lastModified: res.headers.get( 'Last-Modified' ) ?? cached?.lastModified
    };
  }

  public async revalidate ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {
    const cached = this.store && await this.store.get( path );

    if ( ! cached ) {
      const response = await this.httpClient.request( path, options );
      const entry = this.refreshEntry( response );
      this.store && await this.store.set( path, entry );

      return entry;
    }

    const headers = new Headers( options?.headers );
    if ( cached.etag ) headers.set( 'If-None-Match', cached.etag );
    if ( cached.lastModified ) headers.set( 'If-Modified-Since', cached.lastModified );

    const response = await this.httpClient.request( path, { ...options, headers } );

    if ( response.status === 304 ) {
      const updated = this.refreshEntry( response, cached );
      await this.store.set( path, updated );

      return updated;
    }

    const entry = this.refreshEntry( response );
    this.store && await this.store.set( path, entry );

    return entry;
  }

  public async request ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {
    if ( this.mode === 'revalidate' ) return this.revalidate( path, options );
    if ( ! this.store ) return this.refreshEntry( await this.httpClient.request( path, options ) );

    const cached = await this.store.get( path );
    if ( cached && ( this.mode === 'session' || ! this.isExpired( cached ) ) ) return cached;

    const entry = this.refreshEntry( await this.httpClient.request( path, options ) );
    if ( this.mode === 'session' || entry.expires ) await this.store.set( path, entry );

    return entry;
  }

  public async clear () : Promise< void > {
    this.store && await this.store.clear();
  }

  public async delete ( path: string ) : Promise< void > {
    this.store && await this.store.delete( path );
  }

  public get size () : number {
    return this.store ? this.store.size : 0;
  }

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : CacheManager {
    const { type = 'memory', mode = 'ttl' } = options;
    return new CacheManager( type === 'memory' ? new MemoryCache() : type, client, mode );
  }
}
