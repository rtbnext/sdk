import type { ResourceLoader } from '../core/ResourceLoader';
import type { IndexFactory, IndexOptions, IndexResult, ParserFn } from '../types';
import { Resource } from './Resource';


const defaultKeys = ( value: unknown ) : readonly string[] | null => {
  if ( Array.isArray( value ) ) return value.map( String );

  if ( value && typeof value === 'object' && 'items' in value && value.items && typeof value.items === 'object' )
    return Object.keys( value.items as object );

  return null;
};


export class IndexableResource< D, R > extends Resource< D > {
  private readonly factory: IndexFactory< R >;
  private readonly keys: ( value: unknown ) => readonly string[] | null;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: IndexOptions< R > ) {
    super( path, loader, parser );

    this.factory = options.index;
    this.keys = options.keys ?? defaultKeys;
  }

  private createIndex ( keys: readonly string[], path: string[] ) {
    const out: Record< string, unknown > = {};

    for ( const key of keys ) Object.defineProperty( out, key, {
      enumerable: true, configurable: false,
      get: () => this.factory( [ ...path, key ] )
    } );

    return Object.freeze( out );
  }

  private traverse ( value: unknown, path: string[] = [] ) : unknown {
    const keys = this.keys( value );
    if ( keys ) return this.createIndex( keys, path );

    if ( value && typeof value === 'object' ) {
      const out: Record< string, unknown > = {};

      for ( const [ key, child ] of Object.entries( value ) ) {
        if ( key === '$metadata' ) continue;

        Object.defineProperty( out, key, {
          enumerable: true, configurable: false,
          get: () => this.traverse( child, [ ...path, key ] )
        } );
      }

      return Object.freeze( out );
    }

    return undefined;
  }

  public get () : Promise< IndexResult< D, R > > {
    return this.transform( data => this.traverse( data ) as IndexResult< D, R > );
  }
}
