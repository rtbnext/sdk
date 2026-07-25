// --- client identity ---

/** Information, used to identify the client in requests. */
export type ClientIdentity = {
  /** The name of the client, e.g. `my-app`. */
  name: string;
  /** The version of the client, e.g. `1.0.0`. */
  version: string;
  /** Optional contact information for the client, e.g. `https://example.com/contact`. */
  contact?: string;
  /** Optional email address for the client. */
  email?: string;
};

// ---- rate limiter ---

/** Options for the rate limiter. */
export type RateLimiterOptions = {
  /** The maximum number of requests allowed in the given time window. */
  maxRequests: number;
  /** The time window in milliseconds for the rate limiter. */
  perMs: number;
};

// --- http client ---

/** Options for the HTTP client. */
export type HttpClientOptions = {
  /** The base URL for the API. */
  baseUrl: string;
  /** The version of the SDK. */
  sdkVersion: string;
  /** The identity of the client making requests. */
  client: ClientIdentity;
  /** The rate limiter options. */
  limiter: RateLimiterOptions;
  /** The default timeout for requests in milliseconds. */
  timeout: number;
};

/** Options for individual HTTP requests. */
export type RequestOptions = {
  /** Optional headers to include in the request. */
  headers?: Headers;
  /** The rate limiting mode, either 'burst' or 'spread'. */
  mode?: 'burst' | 'spread';
  /** Optional timeout for the request in milliseconds. */
  timeout?: number;
};

/** The response from an HTTP request. */
export type HttpResponse = {
  /** The URL of the request. */
  url: URL;
  /** Whether the request was successful (status code 2xx). */
  ok: boolean;
  /** The HTTP status code of the response. */
  status: number;
  /** The body of the response as a Uint8Array. */
  body: Uint8Array< ArrayBuffer >;
  /** The headers of the response. */
  headers: Headers;
  /** The latency of the request in milliseconds. */
  latency: number;
};
