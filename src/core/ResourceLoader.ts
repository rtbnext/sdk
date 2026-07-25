import type { CacheMode, HttpResponse, ResourceState } from '../types/core';
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
}
