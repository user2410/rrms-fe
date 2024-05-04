import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !==  "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { productId, customer_code, captcha_id, captcha_answer } = req.query;

  try {
    const r = await axios.get(`https://payment-aggregator.zalopay.vn/api/v1/products/${productId}/bills`, {
      params: {
        customer_code,
      },
      headers: {
        "Aggregator-Captcha-Id": captcha_id,
        "Aggregator-Captcha-Answer": captcha_answer,
      },
    });
    return res.status(200).json(await r.data);
  } catch(err: any) {
    switch (err.response.status) {
      case 401:
        return res.status(401).json({ message: "Mã Captcha sai hoặc hết hiệu lực" });
      case 404:
        return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
      default:
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}
