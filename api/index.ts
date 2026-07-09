// @ts-nocheck
export const config = { runtime: "nodejs" };
import server from "../dist/server/server.js";

export default async function handler(request: Request): Promise<Response> {
  return server.fetch(request, {}, {});
}
export const config = { runtime: "nodejs" };
import server from "../dist/server/server.js";

export default async function handler(request: Request): Promise<Response> {
  return server.fetch(request, {}, {});
}
