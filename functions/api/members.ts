/**
 * GET /api/members
 *
 * Returns member list from KV cache. If cache is empty, triggers a sync from
 * Lark automatically (first-visit bootstrap).
 */

import { fetchAccessToken, fetchMembersFromLark, fetchImageBuffer } from "../_lark";

const MEMBERS_TTL = 60 * 60 * 24;
const IMAGE_TTL   = 60 * 60 * 24 * 7;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const kv = env.BIGFORESTS_CACHE;

  // 1. Try KV cache first
  const cached = await kv.get("members");
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "X-Cache": "HIT",
      },
    });
  }

  // 2. Cache miss → fetch from Lark and populate KV
  const APP_ID     = env.LARK_APP_ID     || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const APP_TOKEN  = env.LARK_APP_TOKEN  || "Ff47bOv2za40UIsBTdfjigY9pUp";
  const TABLE_ID   = env.LARK_TABLE_ID   || "tbl4bwoZsVR87yhZ";

  try {
    const accessToken = await fetchAccessToken(APP_ID, APP_SECRET);
    const members = await fetchMembersFromLark(accessToken, APP_TOKEN, TABLE_ID);

    // Populate image cache in background (don't block response)
    context.waitUntil(
      Promise.all(
        members
          .filter((m) => m.file_token)
          .map(async (m) => {
            const existing = await kv.get(`image:${m.file_token}`, "arrayBuffer");
            if (existing) return; // already cached
            const img = await fetchImageBuffer(accessToken, m.file_token!);
            if (img) {
              await kv.put(`image:${m.file_token!}`, img.buffer, {
                expirationTtl: IMAGE_TTL,
                metadata: { contentType: img.contentType },
              });
            }
          })
      )
    );

    const membersForClient = members.map(({ file_token: _ft, ...m }) => m);
    const json = JSON.stringify(membersForClient);

    // Store in KV
    await kv.put("members", json, { expirationTtl: MEMBERS_TTL });

    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    console.error("Members API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch members" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
