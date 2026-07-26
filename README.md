# @rtbnext/sdk

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
