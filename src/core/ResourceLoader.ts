import { Cache, CacheMode, CacheOptions, HttpResponse, RequestOptions, ResourceState } from '../types';
import { EmptyCache } from './EmptyCache';
import { HttpClient } from './HttpClient';
import { MemoryCache } from './MemoryCache';


export class ResourceLoader {
  private constructor (
    private readonly cache: Cache,
    private readonly httpClient: HttpClient,
    private readonly mode: CacheMode
  ) {}

  private createState ( res: HttpResponse, prev?: ResourceState ) : ResourceState {
    const created = Date.now();
    const response = res.status === 304 && prev ? { ...prev.response, headers: res.headers } : res;

    const maxAge = res.headers.get( 'Cache-Control' )?.match( /max-age=(\d+)/i )?.[ 1 ];
    const expires = maxAge ? created + Number( maxAge ) * 1000 : prev?.expires;

    const etag = res.headers.get( 'ETag' ) ?? prev?.etag;
    const lastModified = res.headers.get( 'Last-Modified' ) ?? prev?.lastModified;

    return { response, created, expires, etag, lastModified };
  }

  private async fetch ( path: string, prev?: ResourceState, options?: RequestOptions ) : Promise< ResourceState > {
    const headers = new Headers( options?.headers );
    if ( prev?.etag ) headers.set( 'If-None-Match', prev.etag );
    if ( prev?.lastModified ) headers.set( 'If-Modified-Since', prev.lastModified );

    const res = await this.httpClient.request( path, { ...options, headers } );
    return this.createState( res, prev );
  }

  public get size () : number {
    return this.cache.size;
  }

  public async delete ( path: string ) : Promise< void > {
    this.cache.delete( path );
  }

  public async clear () : Promise< void > {
    this.cache.clear();
  }

  public static getInstance ( client: HttpClient, options: CacheOptions = {} ) : ResourceLoader {
    const { type = 'memory', mode = 'ttl' } = options;
    const cache = type === 'memory' ? new MemoryCache() : type === false ? new EmptyCache() : type;

    return new ResourceLoader( cache, client, mode );
  }
}
