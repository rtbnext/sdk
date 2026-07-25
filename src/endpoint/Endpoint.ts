import type { ResourceLoader } from '../core/ResourceLoader';
import { CsvParser } from '../parser/CsvParser';
import { JsonParser } from '../parser/JsonParser';
import { TextParser } from '../parser/TextParser';
import { DateableResource } from '../resource/DatedResource';
import { Resource } from '../resource/Resource';
import { TimeSeriesResource } from '../resource/TimeSeriesResource';
import type { Endpoints } from '../types/endpoint';
import type { CsvOptions, DateOptions, JsonOptions, TimeSeriesOptions } from '../types/resource';


export abstract class Endpoint {
  constructor (
    protected readonly loader: ResourceLoader,
    protected readonly endpoints: Endpoints
  ) {}

  protected text ( path: string ) : Resource< string > {
    return new Resource< string >( path, this.loader, TextParser.parse );
  }

  protected json < D > ( path: string ) : Resource< D >;
  protected json < D extends { dates: string[] }, R > ( path: string, options: DateOptions< R > ) : DateableResource< D, R >;

  protected json ( path: string, options?: JsonOptions< any > ) {
    const parser = JsonParser.parse;

    if ( ! options ) return new Resource( path, this.loader, parser );
    if ( 'date' in options ) return new DateableResource( path, this.loader, parser, options );

    throw new Error( 'Invalid resource options' );
  }

  protected csv < D > ( path: string ) : Resource< D >;
  protected csv < D extends readonly unknown[], R extends { date: string } > (
    path: string, options: TimeSeriesOptions< D, R >
  ) : TimeSeriesResource< D, R >;

  protected csv ( path: string, options?: CsvOptions< any, any > ) {
    const parser = CsvParser.parse;

    if ( ! options ) return new Resource( path, this.loader, parser );
    if ( 'point' in options ) return new TimeSeriesResource( path, this.loader, parser, options );

    throw new Error( 'Invalid resource options' );
  }
}
