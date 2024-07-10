import axios from "axios";

export const backendAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

// export const publicBackendAPI = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_HTTP_BACKEND_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const serverSideBackendAPI = axios.create({
//   baseURL: process.env.BACKEND_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
