importScripts(
    'https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js',
);
importScripts(
    'https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js',
);

const app = firebase.initializeApp({
    apiKey: "AIzaSyCjkNlYE3v-BMsRMmLL8NMXIze5imMKht4",
    authDomain: "pwamensaje.firebaseapp.com",
    projectId: "pwamensaje",
    storageBucket: "pwamensaje.appspot.com",
    messagingSenderId: "483247889732",
    appId: "1:483247889732:web:3ea634788dab9152464b11"
});

firebase.messaging(app);
