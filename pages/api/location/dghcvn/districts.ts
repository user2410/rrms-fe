import type { NextApiRequest, NextApiResponse } from 'next';
import districts from '@assets/dghc/districts.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {cityCode} = req.query;
  if(!cityCode) {
    return res.status(400).json({ message: 'Invalid query' });
  }

  const districtsList = districts.filter(district => district.cityCode == cityCode);
  if(districtsList.length === 0) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.status(200).json(districtsList);
}
