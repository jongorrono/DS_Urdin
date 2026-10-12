// Usage (from the argi-garbi-site folder):  node tools/localize-assets.mjs
// Downloads every URL in js/assets.js into ./assets and rewrites the file to local paths.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const file = new URL("../js/assets.js", import.meta.url);
let src = await readFile(file, "utf8");
await mkdir(new URL("../assets/", import.meta.url), { recursive: true });

const re = /(\w+):\s*"(https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"]+)"/g;
for (const [, name, url] of [...src.matchAll(re)]) {
  const ext = url.match(/\.(svg|png|jpe?g)$/)?.[1] ?? "png";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} (URL expired? re-export from Figma)`);
  const path = `assets/${name}.${ext}`;
  await writeFile(new URL(`../${path}`, import.meta.url), Buffer.from(await res.arrayBuffer()));
  src = src.replace(url, path);
  console.log("saved", path);
}
await writeFile(file, src);
console.log("Done: js/assets.js now points to local files.");
