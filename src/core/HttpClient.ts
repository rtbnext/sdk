type ClientIdentity = {
  name: string;
  version: string;
  contact?: string;
  email?: string;
};

type HttpClientOptions = {
  baseUrl: string;
  sdkVersion: string;
  client: ClientIdentity;
};

type RequestOptions = {};

type HttpResponse = {};

export class HttpClient {
  private readonly headers: Headers;

  constructor ( private readonly options: HttpClientOptions ) {
    this.headers = this.createHeaders();
  }

  private createHeaders () : Headers {
    const { client, sdkVersion } = this.options;

    if ( ! client.name.trim() ) throw new Error( 'Client name is required.' );
    if ( ! client.version.trim() ) throw new Error( 'Client version is required.' );

    const headers = new Headers();
    let userAgent = `${ client.name }/${ client.version }`;

    const contact = [ client.contact, client.email ].filter( Boolean ).join( '; ' );
    if ( contact.length ) userAgent += ` (${ contact })`;

    headers.set( 'User-Agent', `${ userAgent } @rtbnext/sdk/${ sdkVersion }` );
    headers.set( 'X-Client-Name', client.name );
    headers.set( 'X-Client-Version', client.version );

    if ( client.contact ) headers.set( 'X-Client-Contact', client.contact );

    return headers;
  };

  private async execute ( path: string, options?: RequestOptions ) : Promise< HttpResponse > {}

  public async request ( path: string, options?: RequestOptions ) : Promise< HttpResponse > {}
}
