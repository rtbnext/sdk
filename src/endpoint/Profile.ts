/** Internal provider type used to expose profile helper methods. */
interface ProfileProvider {
  readonly use: {
    entity: Profile[ 'entity' ];
    collect: Profile[ 'collect' ];
    point: Profile[ 'point' ];
  };
}
