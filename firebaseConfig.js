import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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
let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}
const db = getFirestore(app);

export { app, db };