import type { NextApiRequest, NextApiResponse } from 'next';

const products = {
  "17": "Điện",
  "18": "Nước",
  "20": "Internet",
  "21": "Truyền hình",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !==  "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { productId } = req.query;
  const productName = products[productId as keyof typeof products];
  if(!productName) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  try {
    const r = await fetch(`https://payment-aggregator.zalopay.vn/api/v1/products/${productId}/captcha`);
    if (r.status === 404) {
      return res.status(404).json({ message: "Captcha not found" });
    }
    const data = await r.json();
    return res.status(200).json({
      productName,
      ...data,
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });  
  }
}
