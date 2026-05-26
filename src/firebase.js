import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVIwKPxwUmuI9sZyi9FFdJ4C3d-eiw9ek",
  authDomain: "titanlabs-8cd08.firebaseapp.com",
  projectId: "titanlabs-8cd08",
  storageBucket: "titanlabs-8cd08.firebasestorage.app",
  messagingSenderId: "825173988406",
  appId: "1:825173988406:web:5faf4c5915215cdff1f497"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);