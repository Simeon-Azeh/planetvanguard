import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFYV1Oau7G89ilBS3kSvDjrrA4JSdsa50",
  authDomain: "pvanguard-9dae5.firebaseapp.com",
  projectId: "pvanguard-9dae5",
  storageBucket: "pvanguard-9dae5.firebasestorage.app",
  messagingSenderId: "110221483383",
  appId: "1:110221483383:web:216636c5a57d87eb1bd572",
  measurementId: "G-VBDDBD2XYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };