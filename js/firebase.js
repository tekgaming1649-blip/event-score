const firebaseConfig = {
  apiKey: 'AIzaSyC4Hou67AtFXrdxY7epHgkJq7-R_WvUys4',
  authDomain: 'score-de-l-event.firebaseapp.com',
  databaseURL: 'https://score-de-l-event-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'score-de-l-event',
  storageBucket: 'score-de-l-event.firebasestorage.app',
  messagingSenderId: '542710267318',
  appId: '1:542710267318:web:7246a6d6f4cedf44795517',
  measurementId: 'G-PPEXDTGDDS'
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

const auth = firebase.auth();
const database = firebase.database();

// Enable Google as authentication provider
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

window.firebaseAuthReady = true;
console.log('Firebase initialized with authDomain:', firebaseConfig.authDomain);
