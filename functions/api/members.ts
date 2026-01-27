interface Env {
  LARK_APP_ID: string;
  LARK_APP_SECRET: string;
  LARK_APP_TOKEN: string;
  LARK_TABLE_ID: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  // Default values if env vars are not set (fallback for development)
  const APP_ID = env.LARK_APP_ID || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const APP_TOKEN = env.LARK_APP_TOKEN || "Ff47bOv2za40UIsBTdfjigY9pUp";
  const TABLE_ID = env.LARK_TABLE_ID || "tbl4bwoZsVR87yhZ";

  try {
    // 1. Get Tenant Access Token
    const tokenResponse = await fetch(
      "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: APP_ID,
          app_secret: APP_SECRET,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.tenant_access_token;

    // 2. Get Records from Base
    const recordsResponse = await fetch(
      `https://open.larksuite.com/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!recordsResponse.ok) {
      throw new Error(`Failed to fetch records: ${recordsResponse.status}`);
    }

    const recordsData = await recordsResponse.json();
    const records = recordsData.data.items;

    // 3. Transform Data
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
        photo_url: getPhotoUrl(fields["写真"] || fields["photo_url"]),
        description: fields["自己紹介"] || fields["description"] || "BNIビッグフォレスツチャプターのメンバーです。",
      };
    });

    return new Response(JSON.stringify(members), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
