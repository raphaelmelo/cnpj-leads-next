import { createClient, type Client } from "@libsql/client";

let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL not set — configure no Vercel/env.local",
    );
  }
  _client = createClient({ url, authToken });
  return _client;
}

// Proxy lazy: só instancia o cliente na primeira chamada real (runtime)
// Build do Next.js que tenta pré-renderizar rotas dinâmicas não falha mais.
export const db = new Proxy({} as Client, {
  get(_target, prop: keyof Client) {
    const c = getClient();
    const value = c[prop];
    return typeof value === "function" ? value.bind(c) : value;
  },
});
