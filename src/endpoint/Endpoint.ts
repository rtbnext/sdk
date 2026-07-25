import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { CollectableResource } from '../resource/CollectableResource';
import { DateableResource } from '../resource/DateableResource';
import { IndexableResource } from '../resource/IndexableResource';
import { Resource } from '../resource/Resource';
import { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { Endpoints } from '../types/endpoint';
import type {
  CollectOptions, CsvOptions, DateOptions, Entity, IndexOptions,
  JsonOptions, TimeSeriesOptions
} from '../types/resource';


/**
 * Abstract base class for SDK endpoint implementations.
 * 
 * Provides shared resource factory helpers for text, JSON, CSV, collection, index,
 * time series, and date resources.
 */
export abstract class Endpoint {
  /**
   * @param loader - The shared resource loader instance.
   * @param endpoints - The root endpoint registry for cross-endpoint references.
   */
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  /**
   * Creates a text resource for the given endpoint path.
   * 
   * @param path - The resource path to load.
   */
  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < D > ( path: string ) : Resource< D >;
  protected json < D extends { items: I[] }, I extends { uri: string }, E extends Entity< I > > (
    path: string, options: CollectOptions< I, E >
  ) : CollectableResource< D, I, E >;
  protected json < D extends { dates: string[] }, R > ( path: string, options: DateOptions< R > ) : DateableResource< D, R >;
  protected json < D, R > ( path: string, options: IndexOptions< R > ) : IndexableResource< D, R >;

  /**
   * Creates a JSON-backed resource using the appropriate resource wrapper.
   * 
   * @param path - The resource path to load.
   * @param options - Optional resource options for collection, indexing, or dates.
   */
  protected json ( path: string, options?: JsonOptions< any, any, any, any > ) {
    const parser = JsonParser.parse;

    if ( ! options ) return new Resource( path, this.loader, parser );
    if ( 'entity' in options ) return new CollectableResource( path, this.loader, parser, options );
    if ( 'date' in options ) return new DateableResource( path, this.loader, parser, options );
    if ( 'index' in options ) return new IndexableResource( path, this.loader, parser, options );

    throw new Error( 'Invalid resource options' );
  }

  protected csv < D > ( path: string ) : Resource< D >;
  protected csv < D extends readonly unknown[], R extends { date: string } > (
    path: string, options: TimeSeriesOptions< D, R >
  ) : TimeSeriesResource< D, R >;

  /**
   * Creates a CSV-backed resource using the appropriate resource wrapper.
   * 
   * @param path - The resource path to load.
   * @param options - Optional time-series options.
   */
  protected csv ( path: string, options?: CsvOptions< any, any > ) {
    const parser = CsvParser.parse;

    if ( ! options ) return new Resource( path, this.loader, parser );
    if ( 'point' in options ) return new TimeSeriesResource( path, this.loader, parser, options );

    throw new Error( 'Invalid resource options' );
  }
}
