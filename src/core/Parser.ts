export class Parser {
  public static jsonl < T > ( raw: string ) : T[] {
    const data: T[] = [];

    for ( const line of raw.split( '\n' ) ) {
      if ( ! line.trim().length ) continue;
      try { data.push( JSON.parse( line ) as T ) } catch {}
    }

    return data;
  }
}
