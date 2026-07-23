import type { ResourceLoader } from '../core/ResourceLoader';
import type { IndexFactory, IndexOptions, IndexResult, ParserFn } from '../types';
import { Resource } from './Resource';


export class IndexableResource< D, R > extends Resource< D > {
  private readonly factory: IndexFactory< R >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: IndexOptions< R > ) {
    super( path, loader, parser );

    this.factory = options.index;
  }

  private traverse ( value: unknown, path: string[] = [] ) : unknown {
    if ( Array.isArray( value ) ) return this.factory( path, value as readonly string[] );

    if ( value && typeof value === 'object' ) {
      const out: Record< string, unknown > = {};

      for ( const [ key, child ] of Object.entries( value ) ) {
        if ( key === '$metadata' ) continue;
        out[ key ] = this.traverse( child, [ ...path, key ] );
      }

      return Object.freeze( out );
    }

    return undefined;
  }

  public get () : Promise< IndexResult< D, R > > {
    return this.transform( data => this.traverse( data ) as IndexResult< D, R > );
  }
}
