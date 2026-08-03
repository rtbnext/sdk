import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

// --- access profile data ---

client.profile.data( 'bill-gates' ).data().then( data =>
  console.log( data.bio.cv, data.wiki.desc )
);

// --- use the profile index collection ---

client.profile.index.collection().then( profiles => {
  console.log( 'Total:', profiles.total );

  profiles.search( 'space' ).orderBy( 'networth', 'desc' ).take( 5 )
    .forEach( item => console.log( item.name, item.uri ) );
} );

// --- work with profile history ---

client.profile.get( 'elon-musk' ).history.series().then( history => {
  console.log( 'Points:', history.count );
  console.log( 'Latest:', history.last );
  console.log( 'Average:', history.avg( p => p.networth ) );
} );
