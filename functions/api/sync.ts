/**
 * POST /api/sync
 *
 * Fetches all member data (including images) from Lark and stores them in
 * Cloudflare KV (BIGFORESTS_CACHE). Call this endpoint whenever Lark is
 * updated to refresh the public website.
 *
 * KV keys:
 *   members          → JSON array of member objects (TTL: 1 day)
 *   image:<token>    → image binary with content-type metadata (TTL: 7 days)
 */

import { fetchAccessToken, fetchMembersFromLark, fetchImageBuffer } from "../_lark";

const MEMBERS_TTL = 60 * 60 * 24;      // 24 hours
const IMAGE_TTL   = 60 * 60 * 24 * 7;  // 7 days

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  // Allow GET for easy manual trigger from browser, POST for webhook/cron
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const APP_ID     = env.LARK_APP_ID     || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const APP_TOKEN  = env.LARK_APP_TOKEN  || "Ff47bOv2za40UIsBTdfjigY9pUp";
  const TABLE_ID   = env.LARK_TABLE_ID   || "tbl4bwoZsVR87yhZ";
  const kv         = env.BIGFORESTS_CACHE;

  try {
    const accessToken = await fetchAccessToken(APP_ID, APP_SECRET);
    const members = await fetchMembersFromLark(accessToken, APP_TOKEN, TABLE_ID);

    // Fetch and store each image in KV
    const imageResults: { token: string; ok: boolean }[] = [];

    await Promise.all(
      members
        .filter((m) => m.file_token)
        .map(async (m) => {
          const token = m.file_token!;
          const img = await fetchImageBuffer(accessToken, token);
          if (img) {
            await kv.put(`image:${token}`, img.buffer, {
              expirationTtl: IMAGE_TTL,
              metadata: { contentType: img.contentType },
            });
            imageResults.push({ token, ok: true });
          } else {
            imageResults.push({ token, ok: false });
          }
        })
    );

    // Store member list (without internal file_token) in KV
    const membersForClient = members.map(({ file_token: _ft, ...m }) => m);
    await kv.put("members", JSON.stringify(membersForClient), {
      expirationTtl: MEMBERS_TTL,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        synced_members: members.length,
        images: imageResults,
        synced_at: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: any) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
