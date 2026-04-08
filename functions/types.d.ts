interface Env {
  // Cloudflare KV — member JSON and image binary cache
  BIGFORESTS_CACHE: KVNamespace;
  // Lark credentials (set in Cloudflare Pages environment variables)
  LARK_APP_ID: string;
  LARK_APP_SECRET: string;
  LARK_APP_TOKEN: string;
  LARK_TABLE_ID: string;
}

type PagesFunction<Env = unknown, Params = string, Data extends Record<string, unknown> = Record<string, unknown>> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;

interface EventContext<Env, Params, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Params;
  data: Data;
}
