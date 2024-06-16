"use client";

import { checkToken, retrieveToken, saveToken } from '@/actions/device_token/device_token';
import { firebaseApp } from '@/libs/firebase';
import { lsGetFCMToken, lsGetTokenSessionId, lsSaveFCMToken, lsSetTokenSessionId } from '@/models/fcm_token';
import { getMessaging, getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';

const useFcmToken = (userId: string, accessKey: string) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !accessKey) { return; }
    (async () => {
      try {
        // get permission for background notification service worker
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Permission denied');
          return;
        }
  
        // get the token from localStorage
        const storedToken = lsGetFCMToken(userId);
        const storedTokenSessionID = lsGetTokenSessionId();
        if (storedTokenSessionID !== null) {
          if (storedToken !== null) {
            const dt = await checkToken(storedTokenSessionID, storedToken.token, accessKey);
            if (dt) {
              setToken(storedToken.token);
              return;
            }
          } else {
            const dt = await retrieveToken(storedTokenSessionID, accessKey);
            if (dt) {
              lsSaveFCMToken(userId, dt.token);
              setToken(dt.token);
              return;
            }
          }
        }
        
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/firebase-cloud-messaging-push-scope" });

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', async () => {
                if (installingWorker.state === 'activated') {
                  console.log('Service worker activated');
                  try {
                    const messaging = getMessaging(firebaseApp);
                    const currentToken = await getToken(messaging, {
                      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID,
                    });
                    console.log('FCM Token:', currentToken);
                    setToken(currentToken);
                    // save the token to backend service
                    const newDT = await saveToken(currentToken, accessKey);
                    lsSaveFCMToken(userId, currentToken);
                    lsSetTokenSessionId(newDT.sessionId);
                  } catch (err) {
                    console.error('An error occurred while retrieving token. ', err);
                  }
                }
              });
            }
          });

          if (registration.active) {
            console.log('Service worker already active');
            const messaging = getMessaging(firebaseApp);
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID,
            });
            console.log('FCM Token:', currentToken);
            setToken(currentToken);
            // save the token to backend service
            const newDT = await saveToken(currentToken, accessKey);
            lsSaveFCMToken(userId, currentToken);
            lsSetTokenSessionId(newDT.sessionId);
          }
        }
      } catch (error) {
        console.error('An error occurred while retrieving token:', error);
      }
    })();
  }, [userId, accessKey]);

  return { fcmToken: token };
};

export default useFcmToken;
