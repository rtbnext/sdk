import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

client.stats.industryIndex.get()
  .then( i => i.energy.series() )
  .then( s => console.log( s.points ) );
