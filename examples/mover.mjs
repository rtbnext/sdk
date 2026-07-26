import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

// --- get daily winner / loser ---

client.mover.index.get().then( index => index.first.data() ).then( snapshot => {
  console.log( 'Mover snapshot:', snapshot.date );
  console.log( 'Today net worth winners:', snapshot.today.networth.winner );
  console.log( 'Today percent losers:', snapshot.today.percent.loser );
} );
