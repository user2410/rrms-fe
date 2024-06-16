import type { NextApiRequest, NextApiResponse } from "next";
import { BatdongsanVNScrapper } from "./get-news";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { id } = req.query;
  if (typeof id !== "string" || !["GetNewNewsAsHtml", "GetHotSubjectHNAsHtml", "GetHotSubjectHCMAsHtml"].includes(id)) {
    return res.status(400).json({ message: "Bad Request" });
  }
  try {
    const scrapper = new BatdongsanVNScrapper();
    const articles = await scrapper.scrape(
      `https://batdongsan.com.vn/microservice-architecture-router/Systems/Home/${id}`,
    );
    return res.status(200).json(articles);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
