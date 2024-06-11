export type DeviceToken = {
  userId: string;
  sessionId: string;
  token: string;
  platform: "WEB" | "ANDROID" | "IOS";
  lastAccessed: Date;
  createdAt: Date;
};

export type FCMForegroundPayload = {
  from: string;
  messageId: string;
  data: object; // custom metadata
  notification: {
    body: string;
    title: string;
  };
};

export type FCMBackgroundPayload = {
  from: string;
  priority: string;
  data: object; // custom metadata
  notification: {
    body:  string;
    title: string;
  };
  fcmMessageId: string;
  isFirebaseMessaging: boolean;
  messageType: string;
};

export const FCMTokenStorageKey = "fcmToken";
export const FCMTokenSeessionIDStorageKey = "fcmTokenSessionId"; // session id uniquely identify a device to the system
export const FCMDuration = 1000 * 60 * 60 * 24 * 60; // 60 days

export type LSFCMToken = {
  userId: string;
  token: string;
  lastAccess: Date;
};

export function lsGetFCMToken(userId: string): LSFCMToken | null {
  // get the token from localStorage
  var tokenLS: LSFCMToken[];
  const tokenLSStr = localStorage.getItem(FCMTokenStorageKey);
  if (!tokenLSStr) {
    return null;
  } else {
    tokenLS = JSON.parse(tokenLSStr);
  }
  const token = tokenLS.find((t: LSFCMToken) => t.userId === userId);
  if (!token) {
    return null;
  }

  // check if the token is expired
  if (
    new Date().getTime() - new Date(token.lastAccess).getTime() >
    FCMDuration
  ) {
    localStorage.setItem(
      FCMTokenStorageKey,
      JSON.stringify(tokenLS.filter((t: LSFCMToken) => t.userId !== userId)),
    );
    return null;
  }

  // update last access timestamp
  localStorage.setItem(
    FCMTokenStorageKey,
    JSON.stringify([
      ...tokenLS.filter((t: LSFCMToken) => t.userId !== userId),
      {
        userId,
        token: token.token,
        lastAccess: new Date(),
      },
    ]),
  );

  return token;
}

export function lsSaveFCMToken(userId: string, token: string) {
  var tokenLS: LSFCMToken[];
  const tokenLSStr = localStorage.getItem(FCMTokenStorageKey);
  if (!tokenLSStr) {
    tokenLS = [];
  } else {
    tokenLS = JSON.parse(tokenLSStr);
  }

  const object: LSFCMToken = {
    userId,
    token: token,
    lastAccess: new Date(),
  };
  localStorage.setItem(
    FCMTokenStorageKey,
    JSON.stringify([
      ...tokenLS.filter((t: LSFCMToken) => t.userId !== userId),
      object,
    ]),
  );
}

export function lsGetTokenSessionId(): string | null {
  return localStorage.getItem(FCMTokenSeessionIDStorageKey);
}

export function lsSetTokenSessionId(sessionId: string) {
  localStorage.setItem(FCMTokenSeessionIDStorageKey, sessionId);
}
