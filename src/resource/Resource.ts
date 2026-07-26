import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, RequestOptions, ResourceState } from '../types/core';


/**
 * Base resource wrapper for lazy loading, parsing and cache state management.
 * 
 * This class implements loading a resource once, refreshing it on demand, and
 * parsing the HTTP response body through the configured parser.
 */
export class Resource< D > {
  /** Registered lifecycle event handlers for the resource. */
  protected readonly hooks = new Map< string, Set< ( self: this ) => void > >();

  /** Indicates whether the resource has been loaded at least once. */
  protected loaded = false;
  /** Promise tracking the current load operation, if one is in progress. */
  protected loading?: Promise< void >;
  /** The current cached resource state returned by the loader. */
  protected state?: ResourceState;
  /** Indicates whether the resource body has already been parsed. */
  protected parsed = false;
  /** The parsed resource value returned by `data()`. */
  protected value?: D;
  /** The transformed resource value returned by `transform()`. */
  protected transformed?: any | Promise< any >;

  /**
   * Creates a new resource wrapper.
   * 
   * @param path - The resource path for the API request.
   * @param loader - The resource loader used to fetch and cache data.
   * @param parser - The parser function used to decode the response body.
   */
  constructor (
    protected readonly path: string,
    protected readonly loader: ResourceLoader,
    protected readonly parser: ParserFn< D >
  ) {}

  /** Resets parsed resource state so the next call to `data()` re-parses. */
  private reset () : void {
    this.parsed = false, this.value = undefined, this.transformed = undefined;
  }

  /**
   * Parses the loaded response body and emits a parse event.
   * 
   * @returns The parsed resource value.
   */
  private parse () : D {
    this.value = this.parser( this.state!.response ), this.parsed = true;
    this.emit( 'parse' );

    return this.value!;
  }

  /**
   * Convenience helper to transform parsed resource data.
   * 
   * @param fn - The transform function that receives the parsed data.
   * @returns The transformed result.
   */
  protected transform < R > ( fn: ( data: D ) => Promise< R > | R ) : Promise< R > {
    return Promise.resolve( this.transformed ??= Promise.resolve( this.data() ).then( fn )
      .then( v => ( this.transformed = v, this.emit( 'transform' ) ) )
      .catch( e => ( this.transformed = undefined, Promise.reject( e ) ) )
    );
  }

  /**
   * Emits lifecycle events for this resource.
   * 
   * @param events - Event names to emit.
   */
  protected emit ( ...events: string[] ) : void {
    for ( const event of events ) this.hooks.get( event )?.forEach( handler => handler( this ) );
  }

  /**
   * Registers an event handler for the resource.
   * 
   * @param event - The event name.
   * @param handler - The event handler.
   * @returns The current resource instance.
   */
  public on ( event: string, handler: ( self: this ) => void ) : this {
    if ( ! this.hooks.has( event ) ) this.hooks.set( event, new Set() );
    this.hooks.get( event )!.add( handler );

    return this;
  }

  /**
   * Removes an event handler from the resource.
   * 
   * @param event - The event name.
   * @param handler - The event handler to remove.
   * @returns The current resource instance.
   */
  public off ( event: string, handler: ( self: this ) => void ) : this {
    this.hooks.get( event )?.delete( handler );
    return this;
  }

  /** Returns whether the resource is currently valid based on the loader's cache mode. */
  public get valid () : boolean {
    return ! this.loaded || this.loader.valid( this.state );
  }

  /**
   * Loads the resource if it has not already been loaded.
   * 
   * @param options - Optional request options passed to the loader.
   */
  public async load ( options?: RequestOptions ) : Promise< void > {
    if ( this.loaded ) return;

    this.loading ??= this.loader.load( this.path, options )
      .then( state => {
        this.state = state, this.loaded = true;

        this.reset();
        this.emit( 'load', 'update' );
      } )
      .finally( () => this.loading = undefined );

    return this.loading;
  }

  /**
   * Refreshes the resource from the loader and resets the parsed value.
   * 
   * @param options - Optional request options passed to the loader.
   */
  public async refresh ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.refresh( this.path, options );
    this.loaded = true;

    this.reset();
    this.emit( 'refresh', 'update' );
  }

  /**
   * Returns the parsed resource data, loading and parsing on demand.
   * 
   * @returns The parsed resource value.
   */
  public async data () : Promise< D > {
    return this.load().then( () => this.parsed ? this.value! : this.parse() );
  }
}
