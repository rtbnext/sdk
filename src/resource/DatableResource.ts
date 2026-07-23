import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn } from '../types';
import { Resource } from './Resource';


export class DatableResource< D > extends Resource< D > {
  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D > ) {
    super( path, loader, parser );
  }

  public dates () : Promise< unknown > {
    return this.transform( data => undefined );
  }
}
