import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lark API Configuration
const LARK_APP_ID = process.env.LARK_APP_ID || "cli_a9a4ef466eb8de1c";
const LARK_APP_SECRET = process.env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
const LARK_APP_TOKEN = "Ff47bOv2za40UIsBTdfjigY9pUp";
const LARK_TABLE_ID = "tbl4bwoZsVR87yhZ";

async function getLarkAccessToken() {
  try {
    const response = await axios.post(
      "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal",
      {
        app_id: LARK_APP_ID,
        app_secret: LARK_APP_SECRET,
      }
    );
    return response.data.tenant_access_token;
  } catch (error) {
    console.error("Error getting Lark access token:", error);
    throw error;
  }
}

async function getLarkRecords(accessToken: string) {
  try {
    const response = await axios.get(
      `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_APP_TOKEN}/tables/${LARK_TABLE_ID}/records`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page_size: 100,
        },
      }
    );
    return response.data.data.items;
  } catch (error) {
    console.error("Error getting Lark records:", error);
    throw error;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Endpoint for Members
  app.get("/api/members", async (_req, res) => {
    try {
      const accessToken = await getLarkAccessToken();
      const records = await getLarkRecords(accessToken);
      
      // Transform Lark records to Member format
      const members = records.map((record: any) => {
        const fields = record.fields;
        
        // Helper to get link from object or string
        const getLink = (field: any) => {
          if (!field) return "";
          if (typeof field === 'object' && field.link) return field.link;
          return String(field);
        };

        // Helper to get photo URL
        const getPhotoUrl = (field: any) => {
          if (field && Array.isArray(field) && field.length > 0) {
            return field[0].url;
          }
          if (typeof field === 'string') return field;
          // Fallback image if no photo
          return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop";
        };

        // Map Japanese field names to English internal names
        return {
          id: record.record_id,
          name: fields["名前"] || "",
          category: fields["カテゴリ"] || "",
          hp_url: getLink(fields["HP"]),
          product_url: getLink(fields["売りたい商品のURL"]),
          facebook_url: getLink(fields["FB"]),
          photo_url: getPhotoUrl(fields["写真"] || fields["photo_url"]), // Try both Japanese and English
          description: fields["自己紹介"] || fields["description"] || "BNIビッグフォレスツチャプターのメンバーです。",
        };
      });

      res.json(members);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    // Skip API routes
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
