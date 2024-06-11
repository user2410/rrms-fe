const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.join(__dirname, '..', '.env'),
  });
}

// Define the path for the service worker file
const swFilePath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');

// Service worker content with the firebaseConfig inserted
const swContent = `
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "${process.env.FIREBASE_API_KEY}",
  authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.FIREBASE_APP_ID}",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
`;

// Check if the service worker file already exists
if (!fs.existsSync(swFilePath)) {
  // Write the content to the service worker file if it doesn't exist
  fs.writeFileSync(swFilePath, swContent, { encoding: 'utf8' });
  console.log('firebase-messaging-sw.js has been created.');
} else {
  console.log('firebase-messaging-sw.js already exists.');
}
