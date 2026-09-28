import rtbnext from '../src/index';


const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.1.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );


// --- filter profiles ---

client.filter.gender( 'f' ).collection().then( profiles => {
  console.log( 'Female profiles:', profiles.count );
  profiles.take( 10 ).forEach( profile => console.log( profile.name, profile.uri ) );
} );


// --- complex filter queries ---

Promise.all( [
  client.filter.gender( 'f' ).collection(),
  client.filter.industry( 'technology' ).collection(),
  client.filter.age( '40' ).collection()
] ).then( ( [ female, technology, age ] ) =>
  female.intersect( technology ).intersect( age )
).then( profiles => {
  console.log( 'Matching profiles:', profiles.count );
  profiles.forEach( profile => console.log( profile.name, profile.uri ) );
} );
