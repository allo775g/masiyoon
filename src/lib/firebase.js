import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN_9iO1OMZXBxyPPffhn5UfAprIzjye38",
  authDomain: "masyon-bdd27.firebaseapp.com",
  projectId: "masyon-bdd27",
  storageBucket: "masyon-bdd27.firebasestorage.app",
  messagingSenderId: "61979915134",
  appId: "1:61979915134:web:0a4d29f32ad5e4a31cb92f",
  measurementId: "G-TWBGBVYGR0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
