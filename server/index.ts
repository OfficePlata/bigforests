import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LARK_APP_ID = process.env.LARK_APP_ID || "cli_a9a4ef466eb8de1c";
const LARK_APP_SECRET = process.env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
const LARK_APP_TOKEN = "Ff47bOv2za40UIsBTdfjigY9pUp";
const LARK_TABLE_ID = "tbl4bwoZsVR87yhZ";
const LARK_DOMAIN = "open.larksuite.com";

// Simple in-memory token cache
let tokenCache: { token: string; expireAt: number } | null = null;

async function getLarkAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expireAt - 60_000) {
    return tokenCache.token;
  }
  const response = await axios.post(
    `https://${LARK_DOMAIN}/open-apis/auth/v3/app_access_token/internal`,
    { app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET }
  );
  const token = response.data.tenant_access_token;
  const expire = response.data.expire ?? 7200;
  tokenCache = { token, expireAt: Date.now() + expire * 1000 };
  return token;
}

async function getLarkRecords(accessToken: string): Promise<any[]> {
  const response = await axios.get(
    `https://${LARK_DOMAIN}/open-apis/bitable/v1/apps/${LARK_APP_TOKEN}/tables/${LARK_TABLE_ID}/records`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page_size: 100 },
    }
  );
  return response.data.data.items;
}

function getLink(field: any): string {
  if (!field) return "";
  if (typeof field === "object" && field.link) return field.link;
  return String(field);
}

function getName(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field.text) return field.text;
  return String(field);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ── Image proxy ──────────────────────────────────────────────────────────
  // Lark attachment URLs require Bearer auth, so we proxy them here.
  // The browser requests /api/image/:fileToken and gets the image data back.
  app.get("/api/image/:fileToken", async (req, res) => {
    const { fileToken } = req.params;
    try {
      const accessToken = await getLarkAccessToken();

      // Get a short-lived download URL for this file token
      const tmpRes = await axios.get(
        `https://${LARK_DOMAIN}/open-apis/drive/v1/medias/batch_get_tmp_download_url`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { file_tokens: fileToken },
        }
      );

      const urls = tmpRes.data?.data?.tmp_download_urls ?? [];
      if (urls.length === 0) {
        return res.status(404).send("Image not found");
      }

      const downloadUrl: string = urls[0].tmp_download_url;

      // Stream the image from Lark → client
      const imgRes = await axios.get(downloadUrl, { responseType: "stream" });

      const contentType = imgRes.headers["content-type"] || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      // Cache for 1 hour in browser (tmp_url is valid for ~10 min but we re-fetch on miss)
      res.setHeader("Cache-Control", "public, max-age=3600");

      imgRes.data.pipe(res);
    } catch (err) {
      console.error("Image proxy error:", err);
      res.status(500).send("Failed to load image");
    }
  });

  // ── Members API ──────────────────────────────────────────────────────────
  app.get("/api/members", async (_req, res) => {
    try {
      const accessToken = await getLarkAccessToken();
      const records = await getLarkRecords(accessToken);

      const members = records.map((record: any) => {
        const fields = record.fields;
        const photoField = fields["画像URL"];
        let photo_url: string | null = null;

        if (Array.isArray(photoField) && photoField.length > 0) {
          const fileToken = photoField[0].file_token;
          if (fileToken) {
            // Point to our own image proxy — no auth needed from browser
            photo_url = `/api/image/${fileToken}`;
          }
        }

        return {
          id: record.record_id,
          name: getName(fields["名前"]),
          category: (fields["カテゴリ"] || "").trim(),
          hp_url: getLink(fields["HP"]),
          product_url: fields["商品URL"] || "",
          facebook_url: getLink(fields["1to1"]),
          photo_url,
        };
      });

      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(members);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("*", (_req, res) => {
    if (_req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
