export interface Response {
  status?: number;
  body?: string|object;
  headers?: {[key: string]: string};
}
