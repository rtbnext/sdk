import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

// --- list available lists ---

client.list.index.collection().then( lists => {
  console.log( 'Available lists:', lists.count );
  lists.forEach( list => console.log( list.name, list.uri ) );
} );

// --- access list snapshots ---

client.list.index.collection()
  .then( lists => lists.find( 'billionaires' )?.dates.get() )
  .then( dates => dates.year( 2026 ).last.collection() )
  .then( snapshot => {
    console.log( 'Latest snapshot:', snapshot.count );
    snapshot.take( 10 ).forEach( item => console.log( item.name, item.rank ) );
  } );
