import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔴 PASTE YOUR CONFIG HERE 🔴
const firebaseConfig = {
  apiKey: "AIzaSyA2mmqlIH5zZ5qleK_Ax_osQcu1cc5riUE",
  authDomain: "vlog-a463e.firebaseapp.com",
  projectId: "vlog-a463e",
  storageBucket: "vlog-a463e.firebasestorage.app",
  messagingSenderId: "135677829461",
  appId: "1:135677829461:web:d09ea08c67dad2fb750fdc",
  measurementId: "G-N9SFSCM5CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };