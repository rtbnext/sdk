import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

client.list.index.collection()
  .then( c => c.get( 'forbes-400' )?.dates.dates() )
  .then( d => d.year( 2025 ).first?.collection() )
  .then( c => c.page( 1 ).items.forEach( i => console.log(
    `#${ i.rank } :: ${ i.name }, $${ ( i.networth / 1000 ).toFixed( 1 ) }B`
  ) ) );
