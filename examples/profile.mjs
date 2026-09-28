import rtbnext from '../dist/esm/index.js';


const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.1.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );


// --- access profile data ---

client.profile.data( 'bill-gates' ).data().then( data => {
  console.log( 'CV:', data.bio.cv );
  console.log( 'Short:', data.wiki.desc );
} );
