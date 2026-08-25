import assert from "node:assert/strict";
import test from "node:test";

test("renders Weena Tour metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();

  assert.match(html, /<html lang="th">/i);
  assert.match(
    html,
    /<title>Weena Tour \| เข้าป่า 2 Days 1 Night<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="แพ็กเกจท่องเที่ยวและทริปเดินป่าทั้งในประเทศและต่างประเทศ โดย Weena Tour"\/>/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/weena2d1n\.com\/"\/>/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/weena2d1n\.com\/weena-cover\.png"\/>/i,
  );
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/>/i);
  assert.doesNotMatch(html, /codex-preview|Starter Project|A clean starting point/i);
});
