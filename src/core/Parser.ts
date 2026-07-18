export class Parser {
  public static jsonl < T > ( raw: string ) : T[] {
    const data: T[] = [];

    for ( const line of raw.split( '\n' ) ) {
      if ( ! line.trim().length ) continue;
      try { data.push( JSON.parse( line ) as T ) } catch {}
    }

    return data;
  }

  public static csv < T > ( raw: string, delimiter: string = ';' ) : T[] {
    const data: T[] = [];

    for ( const line of raw.split( '\n' ) ) {
      if ( ! line.trim().length ) continue;

      data.push( line.split( delimiter ).map( v => {
        const n = Number( v );
        return Number.isNaN( n ) ? v.trim() : n;
      } ) as unknown as T );
    }

    return data;
  }
}
