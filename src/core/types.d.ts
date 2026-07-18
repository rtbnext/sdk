export type ClientIdentity = {
  name: string;
  version: string;
  contact?: string;
  email?: string;
};

export type HttpClientOptions = {
  baseUrl: string;
  sdkVersion: string;
  client: ClientIdentity;
};

export type ApiResponse< T = unknown > = {
  data: T | null;
  url: URL;
  status: number;
  ok: boolean;
  headers: Headers;
  latency: number;
  parseError?: Error;
  format?: string;
};
