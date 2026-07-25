// --- time series ---

export type PointFn< D extends readonly unknown[], R extends { date: string } > = ( row: D[ number ] ) => R;

export interface TimeSeriesOptions< D extends readonly unknown[], R extends { date: string } > {
  point: PointFn< D, R >;
}

export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface AggregateValue {
  first: number;
  last: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export type AggregatePoint< R extends { date: string } > = {
  [ K in keyof Omit< R, 'date' > ]: R[ K ] extends number ? AggregateValue : R[ K ];
} & {
  date: string;
  label: string;
  range: {
    from: string;
    to: string;
  };
};
