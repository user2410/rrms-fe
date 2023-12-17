import districts from '@assets/dghc/districts.json';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {id} = req.query;

  const district = districts.find(dist => dist.id.toString() === id);
  if(!district) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.status(200).json(district);
}
