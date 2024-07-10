import { backendAPI } from '@/libs/axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // get the full query part of the url, for example https://example.com/api/payment/vnpay_return?trans=1&abc=2 => return trans=1&abc=2
  const query = req.url?.split("?")[1];
  if (!query) {
    return res.status(400).json({ message: "Missing query" });
  }

  // forward the query to backendAPI
  try {
    const r = await backendAPI.get(`/api/payments/vnpay/vnpay_return?${query}`);
    return res.status(200).send("Thanh toán thành công, hãy đóng tab này để tiếp tục"); 
  } catch(err: any) {
    console.error(err);
    return res.status(err.response.status).send(err.response.data);
  }
}