import RTBNext from '../dist/esm/index.js';

const client = new RTBNext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

const status = client.system.status();
console.log( await status.data() );
