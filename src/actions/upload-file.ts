import { backendAPI } from "@/libs/axios";
import axios from "axios";

interface FileUpload {
  name: string;
  size: number;
  type: string;
  url: string;
}

export async function uploadFile(fileUpload: FileUpload, accessToken: string) : Promise<string> {
  const blob = (await axios.get<Blob>(fileUpload.url, { responseType: 'blob' })).data;
  const file = new File([blob], fileUpload.name, { type: fileUpload.type });

  // get presigned url
  const presignedURL = (await backendAPI.post('/api/storage/presign', fileUpload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
  console.log('presignedURL', presignedURL);

  // upload file
  await axios.put(presignedURL.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return presignedURL.url.split('?')[0];
}

// export default async function uploadFile(fileUpload: FileUpload, accessToken: string) : Promise<string> {
//   const blob = await (await fetch(fileUpload.url)).blob();
//   const file = new File([blob], fileUpload.name, { type: fileUpload.type });

//   // get presigned url
//   const presignedURL = await (await fetch('/api/storage/presign', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ accessToken, file: fileUpload }),
//   })).json()
  
//   console.log('presignedURL', presignedURL);

//   console.log('uploadFile', file.size.toString(), file.type, file.name)
//   await fetch(presignedURL.url, {
//     method: 'PUT',
//     headers: {
//       "Content-Type": file.type,
//       "Content-Length": file.size.toString(),
//     },
//     body: file,
//   });
//   return presignedURL.url.split('?')[0];
// }
