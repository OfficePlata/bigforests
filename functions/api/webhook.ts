/**
 * POST /api/webhook
 *
 * Lark Event Subscription endpoint.
 * When a record in the BASE is created/updated/deleted, Lark sends an event
 * here, which triggers an automatic sync to Cloudflare KV.
 *
 * Setup in Lark Open Platform:
 *   Event Subscription URL: https://<your-domain>/api/webhook
 *   Events to subscribe:
 *     - bitable.record.created.v1
 *     - bitable.record.updated.v1
 *     - bitable.record.deleted.v1
 */

import { fetchAccessToken, fetchMembersFromLark, fetchImageBuffer } from "../_lark";

const MEMBERS_TTL = 60 * 60 * 24;
const IMAGE_TTL   = 60 * 60 * 24 * 7;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // ── 1. URL verification challenge (Lark sends this on first setup) ──
  if (body.type === "url_verification" || body.challenge) {
    return new Response(
      JSON.stringify({ challenge: body.challenge }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 2. Record change events → trigger sync ──
  const eventType: string = body?.header?.event_type || body?.event_type || "";
  const isRecordEvent =
    eventType.startsWith("bitable.record") ||
    // also accept generic "table_record_*" style
    eventType.includes("record");

  if (!isRecordEvent) {
    // Unknown event — acknowledge and ignore
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const APP_ID     = env.LARK_APP_ID     || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const APP_TOKEN  = env.LARK_APP_TOKEN  || "Ff47bOv2za40UIsBTdfjigY9pUp";
  const TABLE_ID   = env.LARK_TABLE_ID   || "tbl4bwoZsVR87yhZ";
  const kv         = env.BIGFORESTS_CACHE;

  // Run sync in background so we can return 200 quickly to Lark
  // (Lark expects a response within 3 seconds, otherwise retries)
  context.waitUntil(
    (async () => {
      try {
        const accessToken = await fetchAccessToken(APP_ID, APP_SECRET);
        const members = await fetchMembersFromLark(accessToken, APP_TOKEN, TABLE_ID);

        // Sync images (only new/changed ones)
        await Promise.all(
          members
            .filter((m) => m.file_token)
            .map(async (m) => {
              const img = await fetchImageBuffer(accessToken, m.file_token!);
              if (img) {
                await kv.put(`image:${m.file_token!}`, img.buffer, {
                  expirationTtl: IMAGE_TTL,
                  metadata: { contentType: img.contentType },
                });
              }
            })
        );

        // Update member list (invalidates old cache immediately)
        const membersForClient = members.map(({ file_token: _ft, ...m }) => m);
        await kv.put("members", JSON.stringify(membersForClient), {
          expirationTtl: MEMBERS_TTL,
        });

        console.log(`Webhook sync complete: ${members.length} members at ${new Date().toISOString()}`);
      } catch (err) {
        console.error("Webhook sync error:", err);
      }
    })()
  );

  // Return 200 immediately so Lark doesn't retry
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
