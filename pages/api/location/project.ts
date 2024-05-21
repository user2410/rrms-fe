import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {cityCode, districtId} = req.query;
  if (typeof cityCode !== "string" || typeof districtId !== "string") {
    return res.status(400).json({ message: "Invalid query" });
  }

  try {
    const data = (await axios.get('https://sellernetapi.batdongsan.com.vn/api/project/fetchProjectList', {
      params: {
        cityCode,
        districtId,
      },
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Origin": "*",
        Apiversion: '2020-02-28 18:30',
        "Cache-Control": "no-cache",
        Origin: "https://batdongsan.com.vn",
        Priority: "u=1, i",
        Referer: "https://batdongsan.com.vn/",
      },
    })).data;
    return res.status(200).json(data.Result);
  } catch (err) {
    console.error(err);
    return res.status((err as any).response.status).json((err as any).response.data);
  }
}
