import type { HttpResponse, RequestOptions, ResourceState } from '../types';
import type { ResourceLoader } from './ResourceLoader';


export class Resource< T > {
  private readonly hooks = new Map< string, Set< ( ...args: unknown[] ) => void > >();

  private state!: ResourceState;
  private parsed: boolean = false;
  private value?: T;

  constructor (
    private readonly path: string,
    private readonly loader: ResourceLoader,
    private readonly parser: ( res: HttpResponse ) => T
  ) {}

  public async request ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.request( this.path, options );
    this.parsed = false;
    this.value = undefined;

    this.emit( 'request' );
  }

  public async revalidate ( options?: RequestOptions ) : Promise< void > {
    this.state = await this.loader.revalidate( this.path, options );
    this.parsed = false;
    this.value = undefined;

    this.emit( 'revalidate' );
  }

  public data () : T {
    if ( ! this.parsed ) {
      this.value = this.parser( this.state.response );
      this.parsed = true;

      this.emit( 'parse' );
    }

    return this.value!;
  }
}
