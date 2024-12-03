import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGPJrONEwymdy_WeYaIAn7mTWv3CWopP0",
  authDomain: "proyecto-final-programaci.firebaseapp.com",
  projectId: "proyecto-final-programaci",
  storageBucket: "proyecto-final-programaci.firebasestorage.app",
  messagingSenderId: "451442443822",
  appId: "1:451442443822:web:cfa1599598ccd48aff01bf",
  measurementId: "G-E92G4FY987",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth };
