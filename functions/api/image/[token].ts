/**
 * GET /api/image/:token
 *
 * Serves Lark attachment images via KV cache.
 * KV hit  → returns binary directly (fast, no Lark API call)
 * KV miss → fetches from Lark, stores in KV, returns binary
 */

import { fetchAccessToken, fetchImageBuffer } from "../../_lark";

const IMAGE_TTL = 60 * 60 * 24 * 7; // 7 days

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const fileToken = params.token as string;

  if (!fileToken) {
    return new Response("Missing token", { status: 400 });
  }

  const kv = env.BIGFORESTS_CACHE;
  const kvKey = `image:${fileToken}`;

  // 1. KV cache hit
  const cached = await kv.getWithMetadata<{ contentType: string }>(kvKey, "arrayBuffer");
  if (cached.value) {
    const contentType = cached.metadata?.contentType || "image/jpeg";
    return new Response(cached.value, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "HIT",
      },
    });
  }

  // 2. KV cache miss → fetch from Lark
  const APP_ID     = env.LARK_APP_ID     || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";

  try {
    const accessToken = await fetchAccessToken(APP_ID, APP_SECRET);
    const img = await fetchImageBuffer(accessToken, fileToken);

    if (!img) {
      return new Response("Image not found", { status: 404 });
    }

    // Store in KV for next request
    context.waitUntil(
      kv.put(kvKey, img.buffer, {
        expirationTtl: IMAGE_TTL,
        metadata: { contentType: img.contentType },
      })
    );

    return new Response(img.buffer, {
      headers: {
        "Content-Type": img.contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (err: any) {
    console.error("Image proxy error:", err);
    return new Response("Failed to load image", { status: 500 });
  }
};
