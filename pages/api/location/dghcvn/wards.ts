import type { NextApiRequest, NextApiResponse } from 'next';
import wards from '@assets/dghc/wards.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {districtId} = req.query;
  if(!districtId) {
    return res.status(400).json({ message: 'Invalid query' });
  }

  const wardsList = wards.filter(ward => ward.districtId == districtId);
  if(wardsList.length === 0) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  return res.status(200).json(wardsList);
}
