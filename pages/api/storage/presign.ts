import { backendAPI } from '@/libs/axios'
import type { NextApiRequest, NextApiResponse } from 'next'

//  request: {
//    accessToken,
//    file: {name, type, size},
//  }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {accessToken, file} = req.body
  console.log("body", file, accessToken)

  try {
    const presignURL = (await backendAPI.post('/api/storage/presign', file, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })).data
    res.status(201).json(presignURL)
  } catch (err) {
    console.error(err)
    res.status(500).json({ err })
  }

}
