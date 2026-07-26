import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

// --- get global stats ---

client.stats.global.data().then( stats => {
  console.log( 'Global stats:' );
  console.log( 'Profiles:', stats.count );
  console.log( 'Total wealth:', stats.total );
  console.log( 'Woman quota:', stats.quota );
} );

// --- work with profile scatter data ---

client.stats.scatter.collection().then( scatter => {
  console.log( 'Scatter points:', scatter.count );
  scatter.take( 10 ).forEach( point => console.log( point.name, point.networth, point.age ) );
} );

// --- access history time series ---

client.stats.history.series().then( history => {
  console.log( 'History points:', history.count );
  console.log( 'Newest:', history.first );
  console.log( 'Average profiles:', history.avg( point => point.count ) );

  history.aggregate( 'year' ).forEach( year =>
    console.log( year.label, year.count.last, year.total.avg )
  );
} );
