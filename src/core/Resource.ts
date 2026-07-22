import type { ParserFn, RequestOptions, ResourceState } from '../types';
import type { ResourceLoader } from './ResourceLoader';


export class Resource< T > {
  private readonly hooks = new Map< string, Set< ( self: this ) => void > >();

  private loaded: boolean = false;
  private loading?: Promise< void >;
  private state?: ResourceState;

  private parsed: boolean = false;
  private value?: T;

  constructor (
    private readonly path: string,
    private readonly loader: ResourceLoader,
    private readonly parser: ParserFn< T >
  ) {}

  private emit ( ...events: string[] ) : void {
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

  public async data ( ...args: any[] ) : Promise< T > {
    await this.load();

    if ( ! this.parsed ) {
      this.value = this.parser( this.state!.response, ...args ), this.parsed = true;
      this.emit( 'parse' );
    }

    return this.value!;
  }
}

export class CollectableResource< T > extends Resource< T > {}
