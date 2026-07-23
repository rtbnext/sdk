import rtbnext from '../dist/esm/index.js';

const client = rtbnext( {
  client: {
    name: 'rtbnext-sdk-test',
    version: '1.0.0',
    contact: 'https://npmjs.com/@rtbnext/sdk'
  }
} );

client.filter.index.get()
  .then( index => index.country.US.collection() )
  .then( collection => collection.search( 'Musk' ).first )
  .then( profile => Promise.all( [
    profile?.meta.data(),
    profile?.data.data(),
    profile?.history.data()
  ] ) )
  .then( ( [ meta, data, history ] ) => console.log( {
    name: data?.info.name.fullName,
    modified: meta?.$metadata.lastModified,
    history: history?.length
  } ) );

client.filter.index.get()
  .then( index =>
    Promise.all( [
      index.country.US.collection(),
      index.gender.m.collection(),
      index.industry.technology.collection()
    ] )
  )
  .then( ( [ country, gender, industry ] ) => {
    const genderSet = new Set( gender.map( p => p.uri ) );
    const industrySet = new Set( industry.map( p => p.uri ) );

    return country.filter( p =>
      genderSet.has( p.uri ) &&
      industrySet.has( p.uri )
    );
  } )
  .then( result =>
    result
      .orderBy( 'name' )
      .take( 10 )
  )
  .then( collection => {
    for ( const profile of collection ) {
      console.log( profile.name );
    }
  } );
