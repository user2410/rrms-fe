
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBdP3iSReS5Fdj9Jc3xkPXQuI38QNrnqIQ",
  authDomain: "togeeat-91ef4.firebaseapp.com",
  projectId: "togeeat-91ef4",
  storageBucket: "togeeat-91ef4.appspot.com",
  messagingSenderId: "1049862243129",
  appId: "1:1049862243129:web:b57f47b8fb1c6540355ee8",
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
