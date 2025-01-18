// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDh-P90vaxTi4PDNvXh6TbDnOY-0DDPAY",
  authDomain: "planetvanguard-8b641.firebaseapp.com",
  projectId: "planetvanguard-8b641",
  storageBucket: "planetvanguard-8b641.firebasestorage.app",
  messagingSenderId: "211434275461",
  appId: "1:211434275461:web:7851d1664270f65ea15fec",
  measurementId: "G-N237TK7CPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);