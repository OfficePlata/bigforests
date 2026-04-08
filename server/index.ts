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

async function getLarkAccessToken(): Promise<string> {
  const response = await axios.post(
    `https://${LARK_DOMAIN}/open-apis/auth/v3/app_access_token/internal`,
    { app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET }
  );
  return response.data.tenant_access_token;
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

async function getBatchTmpDownloadUrls(
  accessToken: string,
  fileTokens: string[]
): Promise<Record<string, string>> {
  if (fileTokens.length === 0) return {};
  const response = await axios.get(
    `https://${LARK_DOMAIN}/open-apis/drive/v1/medias/batch_get_tmp_download_url`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { file_tokens: fileTokens.join(",") },
    }
  );
  const result: Record<string, string> = {};
  if (response.data.code === 0) {
    for (const item of response.data.data.tmp_download_urls ?? []) {
      result[item.file_token] = item.tmp_download_url;
    }
  }
  return result;
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

  app.get("/api/members", async (_req, res) => {
    try {
      const accessToken = await getLarkAccessToken();
      const records = await getLarkRecords(accessToken);

      // Collect file tokens for batch image URL fetch
      const fileTokens: string[] = [];
      const tokenToIndex: Record<string, number> = {};

      const members = records.map((record: any, idx: number) => {
        const fields = record.fields;
        const photoField = fields["画像URL"];
        let fileToken: string | null = null;

        if (Array.isArray(photoField) && photoField.length > 0) {
          fileToken = photoField[0].file_token;
          if (fileToken) {
            fileTokens.push(fileToken);
            tokenToIndex[fileToken] = idx;
          }
        }

        return {
          id: record.record_id,
          name: getName(fields["名前"]),
          category: (fields["カテゴリ"] || "").trim(),
          hp_url: getLink(fields["HP"]),
          product_url: fields["商品URL"] || "",
          facebook_url: getLink(fields["1to1"]),
          photo_url: null as string | null,
          file_token: fileToken,
        };
      });

      // Get temporary download URLs for images
      const tmpUrls = await getBatchTmpDownloadUrls(accessToken, fileTokens);
      for (const [token, url] of Object.entries(tmpUrls)) {
        const idx = tokenToIndex[token];
        if (idx !== undefined) members[idx].photo_url = url;
      }

      // Remove internal file_token from response
      const result = members.map(({ file_token: _ft, ...m }) => m);

      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(result);
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
