import { backendAPI } from '@/libs/axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, accessToken, origin, bankCode, language } = req.body;
  if (!id || !accessToken) {
    return res.status(400).json({ message: "Missing id, accessToken" });
  }

  try {
    const r = await backendAPI.post("/api/payments/vnpay/create_payment_url/" + id, {
      bankCode,
      language,
      returnUrl: `${origin}/api/payment/vnpay_return`,
    }, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
    });
    return res.status(201).json({ ...r.data }); 
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
