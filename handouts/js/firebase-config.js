const firebaseConfig = {
  apiKey: "AIzaSyDpTN9yPCswXJwQ0ve1izY3JA3mZVFQTu4",
  authDomain: "candlekeep-mysteries.firebaseapp.com",
  databaseURL: "https://candlekeep-mysteries-default-rtdb.firebaseio.com",
  projectId: "candlekeep-mysteries",
  storageBucket: "candlekeep-mysteries.firebasestorage.app",
  messagingSenderId: "635023906489",
  appId: "1:635023906489:web:63e796ad2b6d0cc84dad68"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
