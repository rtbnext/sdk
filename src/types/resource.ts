// --- time series ---

export type PointFn< D extends readonly unknown[], R extends { date: string } > = ( row: D[ number ] ) => R;

export interface TimeSeriesOptions< D extends readonly unknown[], R extends { date: string } > {
  point: PointFn< D, R >;
}

export type AggregatePeriod = 'week' | 'month' | 'quarter' | 'year';
