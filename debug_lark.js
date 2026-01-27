import axios from 'axios';

const APP_ID = "cli_a9a4ef466eb8de1c";
const APP_SECRET = "RTC8xoAnsE0GsX0ju1aPx4szkJGkZh1O";
const APP_TOKEN = "Ff47bOv2za40UIsBTdfjigY9pUp";
const TABLE_ID = "tbl4bwoZsVR87yhZ";

async function debugLark() {
  try {
    console.log("1. Getting Access Token...");
    const tokenResponse = await axios.post(
      "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal",
      {
        app_id: APP_ID,
        app_secret: APP_SECRET,
      }
    );
    
    const accessToken = tokenResponse.data.tenant_access_token;
    console.log("Access Token obtained.");

    console.log("2. Fetching Records...");
    const recordsResponse = await axios.get(
      `https://open.larksuite.com/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page_size: 5,
        },
      }
    );

    console.log("\n=== Record Structure ===");
    if (recordsResponse.data.data.items.length > 0) {
      const firstRecord = recordsResponse.data.data.items[0];
      console.log(JSON.stringify(firstRecord.fields, null, 2));
      
      console.log("\n=== All Field Names ===");
      console.log(Object.keys(firstRecord.fields));
    } else {
      console.log("No records found.");
    }

  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

debugLark();
