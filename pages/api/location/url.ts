import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const redirectedUrlHandlers : {
  regex: RegExp,
  processFn: (redirectedUrl: string) => { redirectedUrl: string, coord?: { lat: number, lng: number } }
}[] = [
  // Redirect URL type 1: "https://www.google.com/maps/place/%C4%90%E1%BA%A1i+h%E1%BB%8Dc+B%C3%A1ch+khoa+H%C3%A0+N%E1%BB%99i+-+Hanoi+University+of+Science+and+Technology/@21.0050034,105.8412949,17z/data=!4m6!3m5!1s0x3135add3c46cb161:0x463734da30e16629!8m2!3d21.0049984!4d105.8438698!16s%2Fg%2F11s9ffdv17?entry=tts"
  {
    regex: /^https:\/\/www.google.com\/maps\/place\/.+$/,
    processFn: (redirectedUrl: string) => {
      // try 2 ways to extract lat, lng
      const x1 = redirectedUrl.split('@')[1];
      if(x1) {
        const x2 = x1.split(',');
        if (x2.length >= 3) return { redirectedUrl };
        return ({
          redirectedUrl,
          coord: { lat: parseFloat(x2[0]), lng: parseFloat(x2[1]) }
        });
      } else {
        const url = new URL(redirectedUrl);
        const llValue = url.searchParams.get('ll');
        if (!llValue) return { redirectedUrl };
        const ll = llValue.split(',');
        if (ll.length !== 2) return { redirectedUrl };
        return ({
          redirectedUrl,
          coord: { lat: parseFloat(ll[0]), lng: parseFloat(ll[1]) }
        });
      }
    }
  },
  // Redirect URL type 2: "https://www.google.com/maps/search/20.996719,+105.804936?entry=tts"
  {
    regex: /^https:\/\/www.google.com\/maps\/search\/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)),([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)).+$/,
    processFn: (redirectedUrl: string) => {
      const x1 = redirectedUrl.split('/search/')[1];
      if (!x1) return { redirectedUrl };
      const x2 = x1.split(',');
      if (x2.length !== 2) return { redirectedUrl };
      return ({
        redirectedUrl,
        coord: { lat: parseFloat(x2[0]), lng: parseFloat(x2[1]) }
      });
    },
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.query;
  console.log(req.query);
  if (typeof url !== "string") {
    return res.status(400).json({ message: "Invalid query" });
  }
  if(!(/^https:\/\/maps.app.goo.gl\/[a-zA-Z0-9]+$/.test(url))) {
    return res.status(400).json({ message: "Invalid url" });
  }

  try {
    const r = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    switch (r.status) {
      case 302:
        const redirectedUrl = r.headers.location;
        let handler = null;
        for(let i=0; i<redirectedUrlHandlers.length; i++) {
          const h = redirectedUrlHandlers[i];
          if (h.regex.test(redirectedUrl)) {
            handler = h;
            break;
          }
        }
        if (!handler) {
          return res.status(400).json({ message: "Unknown url format" });
        }
        return res.status(200).json(handler.processFn(redirectedUrl));
      case 404:
        return res.status(404).json({ message: "Not found" });
      default:
        return res.status(500).json({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(500).end();
  }
}
