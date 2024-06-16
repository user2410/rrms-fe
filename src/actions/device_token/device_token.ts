import { backendAPI } from "@/libs/axios";
import { DeviceToken } from "@/models/fcm_token";

const PLATFORM = "WEB";

export async function checkToken(
  sessionId: string, token: string,
  accessToken: string,
) {
  console.log("checkToken", sessionId, token, accessToken);
  return (await backendAPI.get<DeviceToken[] | null>("/api/misc/notifications/devices/", {
    params: {
      sessionId,
      token,
      platform: PLATFORM,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
}

export async function retrieveToken(
  sessionId: string,
  accessToken: string,
) {
  console.log("retrieveToken", sessionId, accessToken);
  return (await backendAPI.get<DeviceToken | null>("/api/misc/notifications/devices/", {
    params: {
      sessionId,
      platform: PLATFORM,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
}

export async function saveToken(
  token: string,
  accessToken: string,
) {
  const res = (await backendAPI.post<DeviceToken>("/api/misc/notifications/devices/", {
    token,
    platform: PLATFORM,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
  res.createdAt = new Date(res.createdAt);
  res.lastAccessed = new Date(res.lastAccessed);
  return res;
}
