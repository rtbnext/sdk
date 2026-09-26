/** Default configuration options for the RTBNext SDK. */
export const DEFAULT_OPTIONS = {
  sdkVersion: '1.1.0',
  client: {
    baseUrl: 'https://api.rtbnext.de',
    timeout: 5_000,
    limiter: {
      maxRequests: 60,
      perMs: 10_000
    }
  },
  cache: {
    type: 'memory',
    mode: 'ttl'
  },
  collection: {
    perPage: 10
  }
} as const;
