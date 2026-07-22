import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

const index = await client.profile.search();

for ( const item of index.filter( i => i.gender === 'f' ).orderBy( 'networth', 'desc' ).page( 2 ) ) {
  console.log( `${ item.fullName } (${ item.age }) :: $${ ( item.networth / 1000 ).toFixed( 1 ) }B` );
}
