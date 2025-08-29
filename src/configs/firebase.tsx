import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "commerce-80ce4.firebaseapp.com",
  projectId: "commerce-80ce4",
  storageBucket: "commerce-80ce4.firebasestorage.app",
  messagingSenderId: "624113442548",
  appId: "1:624113442548:web:d00cd11926bcf671e388a1",
  measurementId: "G-5W1RR35F2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();