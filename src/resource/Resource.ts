import type { ResourceLoader } from '../core/ResourceLoader';
import type { ParserFn, RequestOptions, ResourceState } from '../types';


export class Resource< TDocument > {
  protected readonly hooks = new Map< string, Set< ( self: this ) => void > >();

  protected loaded: boolean = false;
  protected loading?: Promise< void >;
  protected state?: ResourceState;

  protected parsed: boolean = false;
  protected value?: TDocument;

  constructor (
    protected readonly path: string,
    protected readonly loader: ResourceLoader,
    protected readonly parser: ParserFn< TDocument >
  ) {}

  protected transform < R > ( fn: ( data: TDocument ) => Promise< R > | R ) : Promise< R > {
    return this.data().then( fn );
  }

  protected emit ( ...events: string[] ) : void {
    for ( const event of events ) this.hooks.get( event )?.forEach( handler => handler( this ) );
  }

  public on ( event: string, handler: ( self: this ) => void ) : this {
    if ( ! this.hooks.has( event ) ) this.hooks.set( event, new Set() );
    this.hooks.get( event )!.add( handler );

    return this;
  }

  public off ( event: string, handler: ( self: this ) => void ) : this {
    this.hooks.get( event )?.delete( handler );

    return this;
  }

  public async load ( options?: RequestOptions ) : Promise< void > {
    if ( this.loaded ) return;

    this.loading ??= this.loader.load( this.path, options )
      .then( state => {
        this.state = state, this.loaded = true, this.parsed = false, this.value = undefined;
        this.emit( 'load', 'update' );
      } )
      .finally( () => this.loading = undefined );

    return this.loading;
  }

  public async refresh ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.refresh( this.path, options );
    this.loaded = true, this.parsed = false, this.value = undefined;
    this.emit( 'refresh', 'update' );
  }

  public async data () : Promise< TDocument > {
    await this.load();

    if ( ! this.parsed ) {
      this.value = this.parser( this.state!.response ), this.parsed = true;
      this.emit( 'parse' );
    }

    return this.value!;
  }
}
