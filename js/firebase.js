const firebaseConfig = {
  apiKey: "AIzaSyD_nm5oSdhXy_j7JPvA73AJRtpdcVlbTXc",
  authDomain: "event-score-3399f.firebaseapp.com",
  databaseURL: "https://event-score-3399f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "event-score-3399f",
  storageBucket: "event-score-3399f.firebasestorage.app",
  messagingSenderId: "714774910449",
  appId: "1:714774910449:web:cb84cf2f51e39f6b8c80fc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
