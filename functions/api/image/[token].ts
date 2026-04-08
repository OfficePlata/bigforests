interface Env {
  LARK_APP_ID: string;
  LARK_APP_SECRET: string;
}

const LARK_DOMAIN = "open.larksuite.com";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, params } = context;

  const APP_ID = env.LARK_APP_ID || "cli_a9a4ef466eb8de1c";
  const APP_SECRET = env.LARK_APP_SECRET || "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
  const fileToken = params.token as string;

  if (!fileToken) {
    return new Response("Missing token", { status: 400 });
  }

  try {
    // 1. Get access token
    const tokenRes = await fetch(
      `https://${LARK_DOMAIN}/open-apis/auth/v3/app_access_token/internal`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      }
    );
    if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status}`);
    const tokenData: any = await tokenRes.json();
    const accessToken: string = tokenData.tenant_access_token;

    // 2. Get temporary download URL for this file token
    const tmpRes = await fetch(
      `https://${LARK_DOMAIN}/open-apis/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileToken}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!tmpRes.ok) throw new Error(`TmpUrl error: ${tmpRes.status}`);
    const tmpData: any = await tmpRes.json();

    const urls = tmpData?.data?.tmp_download_urls ?? [];
    if (urls.length === 0) {
      return new Response("Image not found", { status: 404 });
    }

    const downloadUrl: string = urls[0].tmp_download_url;

    // 3. Fetch the actual image and stream back to browser
    const imgRes = await fetch(downloadUrl);
    if (!imgRes.ok) throw new Error(`Image fetch error: ${imgRes.status}`);

    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    return new Response(imgRes.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Image proxy error:", err);
    return new Response("Failed to load image", { status: 500 });
  }
};
