// scripts/postbuild.mjs

import { mkdir, writeFile } from 'node:fs/promises';


await mkdir( 'dist/cjs', { recursive: true } );
await writeFile( 'dist/cjs/package.json', JSON.stringify( { type: 'commonjs' }, null, 2 ) );

await mkdir( 'dist/esm', { recursive: true } );
await writeFile( 'dist/esm/package.json', JSON.stringify( { type: 'module' }, null, 2 ) );
