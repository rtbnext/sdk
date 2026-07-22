import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

const index = await client.profile.index();
console.log( index.count, index.first.name, await index.last.get.data.data() );
console.log( index.find( 'bill-gates' ).desc );
