import type { ParserFn, RequestOptions, ResourceState } from '../types';
import type { ResourceLoader } from './ResourceLoader';


export class Resource< T > {
  private readonly hooks = new Map< string, Set< ( self: this ) => void > >();

  private state?: ResourceState;
  private parsed: boolean = false;
  private value?: T;

  constructor (
    private readonly path: string,
    private readonly loader: ResourceLoader,
    private readonly parser: ParserFn
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

  public async request ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.request( this.path, options );
    this.parsed = false;
    this.value = undefined;

    this.emit( 'request', 'update' );
  }

  public async revalidate ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.revalidate( this.path, options );
    this.parsed = false;
    this.value = undefined;

    this.emit( 'revalidate', 'update' );
  }

  public data ( ...args: any[] ) : T {
    if ( ! this.state ) throw new Error( 'Resource has not been loaded.' );

    if ( ! this.parsed ) {
      this.value = this.parser( this.state.response, ...args );
      this.parsed = true;

      this.emit( 'parse' );
    }

    return this.value!;
  }
}
