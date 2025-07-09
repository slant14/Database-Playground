export interface Column {
  name: string;
  type: string;
  attrs?: string;
}

export interface DBSchema {
  name: string;
  columns: Column[];
}

export interface QueryData {
  columns: string[];
  data: Record<string, any[]>;
}

export interface QueryResult {
  query: string;
  rowcount: number;
  data?: QueryData; // can be undefined (for example, if not SELECT)
  execution_time: number;
}
