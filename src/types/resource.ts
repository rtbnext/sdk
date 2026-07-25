// --- time series ---

export interface TimeSeriesOptions< D extends readonly unknown[], R extends { date: string } > {
  point ( row: D[ number ] ) : R;
}
