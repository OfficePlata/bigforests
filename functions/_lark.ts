/**
 * Shared Lark API helpers for Cloudflare Pages Functions
 */

export const LARK_DOMAIN = "open.larksuite.com";

export function getLink(field: any): string {
  if (!field) return "";
  if (typeof field === "object" && field.link) return field.link;
  return String(field);
}

export function getName(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field.text) return field.text;
  return String(field);
}

export async function fetchAccessToken(appId: string, appSecret: string): Promise<string> {
  const res = await fetch(
    `https://${LARK_DOMAIN}/open-apis/auth/v3/app_access_token/internal`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    }
  );
  if (!res.ok) throw new Error(`Lark auth failed: ${res.status}`);
  const data: any = await res.json();
  if (data.code !== 0) throw new Error(`Lark auth error: ${data.msg}`);
  return data.tenant_access_token;
}

export interface LarkMember {
  id: string;
  name: string;
  category: string;
  hp_url: string;
  product_url: string;
  facebook_url: string;
  photo_url: string | null;
  file_token: string | null;
}

export async function fetchMembersFromLark(
  accessToken: string,
  appToken: string,
  tableId: string
): Promise<LarkMember[]> {
  const res = await fetch(
    `https://${LARK_DOMAIN}/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Lark records failed: ${res.status}`);
  const data: any = await res.json();
  if (data.code !== 0) throw new Error(`Lark records error: ${data.msg}`);

  return data.data.items.map((record: any) => {
    const fields = record.fields;
    const photoField = fields["画像URL"];
    let fileToken: string | null = null;

    if (Array.isArray(photoField) && photoField.length > 0) {
      fileToken = photoField[0].file_token ?? null;
    }

    return {
      id: record.record_id,
      name: getName(fields["名前"]),
      category: (fields["カテゴリ"] || "").trim(),
      hp_url: getLink(fields["HP"]),
      product_url: fields["商品URL"] || "",
      facebook_url: getLink(fields["1to1"]),
      photo_url: fileToken ? `/api/image/${fileToken}` : null,
      file_token: fileToken,
    };
  });
}

export async function fetchImageBuffer(
  accessToken: string,
  fileToken: string
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  // Get temporary download URL
  const tmpRes = await fetch(
    `https://${LARK_DOMAIN}/open-apis/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileToken}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!tmpRes.ok) return null;

  const tmpData: any = await tmpRes.json();
  const urls = tmpData?.data?.tmp_download_urls ?? [];
  if (urls.length === 0) return null;

  const imgRes = await fetch(urls[0].tmp_download_url);
  if (!imgRes.ok) return null;

  const buffer = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";
  return { buffer, contentType };
}
