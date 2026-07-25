// --- client identity ---

export type ClientIdentity = {
  name: string;
  version: string;
  contact?: string;
  email?: string;
};

// ---- rate limiter ---

export type RateLimiterOptions = {
  maxRequests: number;
  perMs: number;
};

// --- http client ---

export type HttpClientOptions = {
  baseUrl: string;
  sdkVersion: string;
  client: ClientIdentity;
  limiter: RateLimiterOptions;
  timeout: number;
};

export type RequestOptions = {
  headers?: Headers;
  mode?: 'burst' | 'spread';
  timeout?: number;
};

export type HttpResponse = {
  url: URL;
  ok: boolean;
  status: number;
  body: Uint8Array< ArrayBuffer >;
  headers: Headers;
  latency: number;
};
