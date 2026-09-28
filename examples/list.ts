import rtbnext from '../src/index';


const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.1.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );


// --- list available lists ---

client.list.index.collection().then( lists => {
  console.log( 'Available lists:', lists.count );
  lists.forEach( list => console.log( list.name, list.uri ) );
} );
