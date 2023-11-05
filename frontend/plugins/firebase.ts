// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from '@firebase/functions';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBnISfC537EPFvRlW-ctaw2oix8fxZSnFE',
  authDomain: 'malleable-app.firebaseapp.com',
  projectId: 'malleable-app',
  storageBucket: 'malleable-app.appspot.com',
  messagingSenderId: '1000468865762',
  appId: '1:1000468865762:web:cefa104ffa88ef69d434bb',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const functions = getFunctions(firebaseApp, 'southamerica-east1');

export const firebaseFunctions = {
  openaiCompletion: httpsCallable(functions, 'openaiCompletion'),
};
