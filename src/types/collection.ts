export type ItemFactory< T, R > = ( item: T ) => R;

export type DateResolver< T > = ( item: T ) => string;
