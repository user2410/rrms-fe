import { backendAPI } from '@/libs/axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email and/or password" });
  }

  try {
    const r = await backendAPI.post('/api/auth/credential/register', { email, password });
    return res.status(201).json(r.data);
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

}
