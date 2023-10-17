export type AppwriteRequest = {
  bodyRaw: string;
  body: any;
  headers: Record<string, string>;
  scheme: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  host: string;
  port: number;
  path: string;
  query: Record<string, string>;
  queryString: string;
};

export type AppwriteResponseResult = 'AppwriteResponseResult';
export type AppwriteResponse = {
  empty: () => AppwriteResponseResult;
  json: (result: Record<string, any>) => AppwriteResponseResult;
  redirect: (url: string, status: number) => AppwriteResponseResult;
  send: (raw: string, status: number, headers: Record<string, string>) => AppwriteResponseResult;
};

export type AppwriteContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log: (msg: any) => void;
  error: (msg: any) => void;
};
