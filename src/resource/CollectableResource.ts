import { ResourceLoader } from '../core/ResourceLoader';
import { ParserFn } from '../types/core';
import type { CollectOptions, Entity, EntityFn, SearchFn } from '../types/resource';
import { Resource } from './Resource';


const defaultSearch: SearchFn< any > = ( item, query, terms ) => false;


export class CollectableResource< D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > extends Resource< D > {
  private readonly entity: EntityFn< I, E >;
  private readonly search: SearchFn< I >;

  constructor ( path: string, loader: ResourceLoader, parser: ParserFn< D >, options: CollectOptions< I, E > ) {
    super( path, loader, parser );
    this.entity = options.entity;
    this.search = options.search ?? defaultSearch;
  }
}
