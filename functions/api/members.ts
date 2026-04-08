interface Env {
  LARK_APP_ID: string;
  LARK_APP_SECRET: string;
  LARK_APP_TOKEN: string;
  LARK_TABLE_ID: string;
}

const LARK_DOMAIN = "open.larksuite.com";

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

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;

  const APP_ID = env.LARK_APP_ID || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const APP_TOKEN = env.LARK_APP_TOKEN || "Ff47bOv2za40UIsBTdfjigY9pUp";
  const TABLE_ID = env.LARK_TABLE_ID || "tbl4bwoZsVR87yhZ";

  try {
    // 1. Get Tenant Access Token
    const tokenRes = await fetch(
      `https://${LARK_DOMAIN}/open-apis/auth/v3/app_access_token/internal`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      }
    );
    if (!tokenRes.ok) throw new Error(`Token fetch failed: ${tokenRes.status}`);
    const tokenData: any = await tokenRes.json();
    const accessToken: string = tokenData.tenant_access_token;

    // 2. Get Records
    const recordsRes = await fetch(
      `https://${LARK_DOMAIN}/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?page_size=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!recordsRes.ok) throw new Error(`Records fetch failed: ${recordsRes.status}`);
    const recordsData: any = await recordsRes.json();
    const records: any[] = recordsData.data.items;

    // 3. Build member list
    // photo_url points to our own image proxy (/api/image/:token) so the browser
    // never needs to authenticate directly with Lark.
    const result = records.map((record: any) => {
      const fields = record.fields;
      const photoField = fields["画像URL"];
      let photo_url: string | null = null;

      if (Array.isArray(photoField) && photoField.length > 0) {
        const fileToken = photoField[0].file_token;
        if (fileToken) photo_url = `/api/image/${fileToken}`;
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

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
