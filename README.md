# @rtbnext/sdk

[![Static Badge](https://img.shields.io/badge/sdk-rtbnext?style=for-the-badge&label=rtbnext&color=%23d3ff1a)](https://rtbnext.de)
[![NPM License](https://img.shields.io/npm/l/%40rtbnext%2Fsdk?style=for-the-badge)](https://github.com/rtbnext/sdk/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/%40rtbnext%2Fsdk?style=for-the-badge)](https://npmjs.com/@rtbnext/sdk)

**Official JavaScript/TypeScript SDK for the RTBNext API.**

The RTBNext SDK provides a typed, asynchronous interface for accessing billionaire profiles, lists, filters, statistics, historical data and system information from the [RTBNext API](https://api.rtbnext.de).

The SDK follows a consistent resource-oriented design: resources are loaded lazily, cached according to the configured cache mode, and expose typed helper methods for collections, time series and indexed data.

For a complete list of available API endpoints, please refer to the [API Documentation](https://docs.rtbnext.de). Visit the [API endpoint](https://api.rtbnext.de) or check the [SDK Documentation](https://sdk.rtbnext.de) for more information. Check the [System Status](https://status.rtbnext.de) for any ongoing issues or maintenance.

## Installation

Install the package using npm:

```bash
npm install @rtbnext/sdk
```

## First usage

Every client application **must identify** itself when creating an SDK instance. This information is sent with API requests and helps to provide transparency about API consumers.

```ts
import rtbnext from '@rtbnext/sdk';

const client = rtbnext( {
  client: {
    name: 'my-application',
    version: '1.0.0',
    contact: 'https://example.com/contact'
  }
} );
```

The client identity consists of:

- `name` — application or project name
- `version` — application version
- `contact` — optional contact URL
- `email` — optional contact email address

## Core concepts

### Lazy resources

Resources are not downloaded when they are created. Data is loaded only when it is requested.

```ts
const profile = client.profile.get( 'bill-gates' );

// No request has been made yet.

profile.meta.data().then( console.log );
```

### Collections

Collection resources provide filtering, searching, sorting and paging helpers.

```ts
client.profile.index.collection()
  .then( profiles =>
    profiles.search( 'bill' )
      .orderBy( 'networth', 'desc' )
      .take( 5 )
  )
  .then( console.log );
```

### Time series

Historical data can be accessed through typed time-series resources.

```ts
client.profile.get( 'bill-gates' )
  .history.series().then( history =>
    console.log( history.first )
  );
```

## Cache behavior

The SDK includes a configurable resource cache layer that follows HTTP cache semantics. Resources are cached according to the selected cache mode and server-provided cache headers.

Supported cache modes:

- `ttl` — uses the server-defined cache lifetime (`Cache-Control`)
- `revalidate` — performs conditional requests using validators such as `ETag` and `Last-Modified`
- `session` — keeps resources during the lifetime of the SDK instance

The SDK does **not bypass HTTP cache** validation. Expired resources are refreshed according to the configured mode to prevent serving outdated data indefinitely.

A custom cache implementation can be provided by implementing the `Cache` interface. This allows applications to integrate their own storage solutions, such as persistent databases, filesystem caches, browser storage, or distributed cache systems.

The cache interface requires the following operations:

- retrieve a cached resource state
- store a resource state
- delete a resource
- clear the cache
- report the current cache size

## Requirements

- Node.js 18+
- Fetch API support

## License

**Copyright © 2026 RTBNext**  
Created and maintained by [Paul Köhler](https://komed3.de) (komed3).  
Licensed under the [MIT License](./LICENSE).
