import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcXrlcUnoxUib3SM0INde_X3TeXGpFD0A",
  authDomain: "sgb-agro-industries.firebaseapp.com",
  projectId: "sgb-agro-industries",
  storageBucket: "sgb-agro-industries.firebasestorage.app",
  messagingSenderId: "256613552158",
  appId: "1:256613552158:web:7a2927f7e82e7ccba49e0f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;