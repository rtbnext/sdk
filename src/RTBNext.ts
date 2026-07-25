const DEFAULT_OPTIONS = {
  sdkVersion: '1.0.0',
  baseUrl: 'https://api.rtbnext.de',
  httpTimeout: 5_000,
  limiter: { maxRequests: 60, perMs: 10_000 },
  cache: { type: 'memory', mode: 'ttl' }
} as const;
