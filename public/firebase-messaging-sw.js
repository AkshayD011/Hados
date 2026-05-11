// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "REPLACED_BY_VITE_BUILD_OR_NOT_NEEDED_HERE_FOR_SW",
  authDomain: "hados-e5220.firebaseapp.com",
  projectId: "hados-e5220",
  storageBucket: "hados-e5220.firebasestorage.app",
  messagingSenderId: "91922861807",
  appId: "1:919228618072:web:db879c4076dff942a8812d"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Fallback icon
    data: payload.data // Contains redirect URL, etc.
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
