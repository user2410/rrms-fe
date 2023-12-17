import wards from '@assets/dghc/wards.json';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {id} = req.query;

  const ward = wards.find(w => w.id.toString() === id);
  if(!ward) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.status(200).json(ward);
}
