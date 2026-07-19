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

  private createEntry ( res: HttpResponse ) : CacheEntry {
    const created = Date.now();
    const cacheControl = res.headers.get( 'Cache-Control' ) ?? undefined;

    let expires: number | undefined, match: RegExpMatchArray | null;
    if ( cacheControl && ( match = cacheControl.match( /max-age=(\d+)/i ) ) )
      expires = created + Number( match[ 1 ] ) * 1000;

    return {
      response: res, created, expires, etag: res.headers.get( 'ETag' ) ?? undefined,
      lastModified: res.headers.get( 'Last-Modified' ) ?? undefined
    };
  }

  public async revalidate ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {
    const cached = this.store && await this.store.get( path );

    if ( ! cached ) {
      const response = await this.httpClient.request( path, options );
      const entry = this.createEntry( response );

      this.store && await this.store.set( path, entry );
      return entry;
    }

    const headers = new Headers( options?.headers );
    if ( cached.etag ) headers.set( 'If-None-Match', cached.etag );
    if ( cached.lastModified ) headers.set( 'If-Modified-Since', cached.lastModified );

    const response = await this.httpClient.request( path, { ...options, headers } );

    if ( response.status === 304 ) {
      const updated: CacheEntry = { ...cached, created: Date.now() };
      this.store && await this.store.set( path, updated );
      return updated;
    }

    const entry = this.createEntry( response );
    this.store && await this.store.set( path, entry );
    return entry;
  }

  public async request ( path: string, options?: RequestOptions ) : Promise< CacheEntry > {
    const cached = this.store && await this.store.get( path );
    if ( cached ) return cached;

    const res = await this.httpClient.request( path, options );
    const entry = { response: res, created: new Date().getTime() };

    this.store && await this.store.set( path, entry );
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
